package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.CheckoutRequest;
import com.anacecilia.backend.dto.OrdenItemDto;
import com.anacecilia.backend.dto.OrdenResponse;
import com.anacecilia.backend.entity.*;
import com.anacecilia.backend.repository.CursoRepository;
import com.anacecilia.backend.repository.OrdenRepository;
import com.anacecilia.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final InscripcionService inscripcionService;

    @Transactional
    public Orden crearOrden(String email, CheckoutRequest req, String externalReference) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Orden orden = Orden.builder()
                .usuario(usuario)
                .externalReference(externalReference)
                .estado(Orden.Estado.PENDIENTE)
                .total(0.0)
                .items(new ArrayList<>())
                .build();

        double total = 0.0;
        for (CheckoutRequest.CheckoutItemDto it : req.getItems()) {
            int cantidad = it.getCantidad() != null && it.getCantidad() > 0 ? it.getCantidad() : 1;
            OrdenItem item = OrdenItem.builder()
                    .tipo("course".equalsIgnoreCase(it.getTipo()) || "curso".equalsIgnoreCase(it.getTipo())
                            ? OrdenItem.Tipo.CURSO : OrdenItem.Tipo.PRODUCTO)
                    .referenciaId(it.getId())
                    .titulo(it.getTitulo())
                    .imagen(it.getImagen())
                    .precio(it.getPrecio())
                    .cantidad(cantidad)
                    .orden(orden)
                    .build();
            total += it.getPrecio() * cantidad;
            orden.getItems().add(item);
        }
        orden.setTotal(total);
        return ordenRepository.save(orden);
    }

    @Transactional(readOnly = true)
    public List<OrdenResponse> listarPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ordenRepository.findByUsuarioOrderByCreatedAtDesc(usuario)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrdenResponse obtenerPorExternalReference(String externalReference) {
        return ordenRepository.findByExternalReference(externalReference)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
    }

    @Transactional
    public void marcarComoPagada(Long ordenId, String paymentId, String preferenceId) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        if (orden.getEstado() == Orden.Estado.PAGADA) return;

        orden.setEstado(Orden.Estado.PAGADA);
        orden.setPaymentId(paymentId);
        if (preferenceId != null) orden.setPreferenceId(preferenceId);
        ordenRepository.save(orden);

        for (OrdenItem item : orden.getItems()) {
            if (item.getTipo() == OrdenItem.Tipo.CURSO) {
                cursoRepository.findById(item.getReferenciaId()).ifPresent(curso ->
                        inscripcionService.inscribir(orden.getUsuario().getEmail(), curso.getId()));
            }
        }
        log.info("Orden {} marcada como PAGADA, inscripciones generadas", orden.getId());
    }

    @Transactional
    public void marcarComoFallida(Long ordenId, String paymentId) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        orden.setEstado(Orden.Estado.FALLIDA);
        orden.setPaymentId(paymentId);
        ordenRepository.save(orden);
    }

    @Transactional
    public void actualizarPreferenceId(Long ordenId, String preferenceId) {
        ordenRepository.findById(ordenId).ifPresent(o -> {
            o.setPreferenceId(preferenceId);
            ordenRepository.save(o);
        });
    }

    public OrdenResponse toResponse(Orden o) {
        List<OrdenItemDto> items = o.getItems().stream().map(it -> OrdenItemDto.builder()
                .id(it.getId())
                .tipo(it.getTipo().name())
                .referenciaId(it.getReferenciaId())
                .titulo(it.getTitulo())
                .imagen(it.getImagen())
                .precio(it.getPrecio())
                .cantidad(it.getCantidad())
                .build()).collect(Collectors.toList());

        return OrdenResponse.builder()
                .id(o.getId())
                .externalReference(o.getExternalReference())
                .preferenceId(o.getPreferenceId())
                .paymentId(o.getPaymentId())
                .total(o.getTotal())
                .estado(o.getEstado().name())
                .items(items)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
