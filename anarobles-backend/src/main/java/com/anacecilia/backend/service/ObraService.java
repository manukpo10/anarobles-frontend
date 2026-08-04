package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.ObraRequest;
import com.anacecilia.backend.dto.ObraResponse;
import com.anacecilia.backend.entity.Obra;
import com.anacecilia.backend.repository.ObraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ObraService {

    private final ObraRepository obraRepository;

    public List<ObraResponse> listarPublicadas() {
        return obraRepository.findByPublicadoTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ObraResponse> listarTodas() {
        return obraRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ObraResponse obtenerPorId(Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra no encontrada con ID: " + id));
        if (!obra.getPublicado()) {
            throw new RuntimeException("Obra no encontrada");
        }
        return toResponse(obra);
    }

    public ObraResponse obtenerPorIdAdmin(Long id) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra no encontrada con ID: " + id));
        return toResponse(obra);
    }

    @Transactional
    public ObraResponse crear(ObraRequest request) {
        Obra obra = Obra.builder()
                .titulo(request.getTitulo())
                .slug(generarSlugUnico(request.getTitulo()))
                .categoria(request.getCategoria())
                .anio(request.getAnio())
                .tecnica(request.getTecnica())
                .dimensiones(request.getDimensiones())
                .disponibilidad(request.getDisponibilidad() != null ? request.getDisponibilidad() : "disponible")
                .destacada(request.getDestacada() != null ? request.getDestacada() : false)
                .imagen(request.getImagen())
                .imgW(request.getImgW())
                .imgH(request.getImgH())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .publicado(request.getPublicado() != null ? request.getPublicado() : true)
                .build();
        return toResponse(obraRepository.save(obra));
    }

    @Transactional
    public ObraResponse actualizar(Long id, ObraRequest request) {
        Obra obra = obraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Obra no encontrada con ID: " + id));
        // El slug no se regenera en la actualización: es la URL pública de la obra
        // y mantenerlo estable evita romper enlaces existentes aunque cambie el título.
        obra.setTitulo(request.getTitulo());
        obra.setCategoria(request.getCategoria());
        obra.setAnio(request.getAnio());
        obra.setTecnica(request.getTecnica());
        obra.setDimensiones(request.getDimensiones());
        if (request.getDisponibilidad() != null) obra.setDisponibilidad(request.getDisponibilidad());
        if (request.getDestacada() != null) obra.setDestacada(request.getDestacada());
        obra.setImagen(request.getImagen());
        obra.setImgW(request.getImgW());
        obra.setImgH(request.getImgH());
        obra.setDescripcion(request.getDescripcion());
        obra.setPrecio(request.getPrecio());
        if (request.getPublicado() != null) obra.setPublicado(request.getPublicado());
        return toResponse(obraRepository.save(obra));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!obraRepository.existsById(id)) {
            throw new RuntimeException("Obra no encontrada con ID: " + id);
        }
        obraRepository.deleteById(id);
    }

    /**
     * Genera un slug único a partir del título: minúsculas, sin acentos/diacríticos,
     * espacios y símbolos colapsados a un único guion, sin guiones al borde.
     * Si el slug base ya existe, agrega un sufijo numérico (-2, -3, ...) hasta ser único.
     */
    private String generarSlugUnico(String titulo) {
        String base = generarSlugBase(titulo);
        String slug = base;
        int contador = 2;
        while (obraRepository.existsBySlug(slug)) {
            slug = base + "-" + contador;
            contador++;
        }
        return slug;
    }

    private String generarSlugBase(String titulo) {
        // NFD descompone letras acentuadas (á, é, í, ó, ú, ñ, ...) en letra base + marca
        // combinante, que luego se elimina con \p{M}. Cubre los mismos casos que un mapeo
        // manual (á→a, é→e, í→i, ó→o, ú→u, ñ→n) pero de forma general para cualquier acento.
        String normalizado = Normalizer.normalize(titulo.toLowerCase(), Normalizer.Form.NFD);
        String sinAcentos = normalizado.replaceAll("\\p{M}", "");
        String slug = sinAcentos.replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
        return slug.isEmpty() ? "obra" : slug;
    }

    private ObraResponse toResponse(Obra o) {
        return ObraResponse.builder()
                .id(o.getId())
                .titulo(o.getTitulo())
                .slug(o.getSlug())
                .categoria(o.getCategoria())
                .anio(o.getAnio())
                .tecnica(o.getTecnica())
                .dimensiones(o.getDimensiones())
                .disponibilidad(o.getDisponibilidad())
                .destacada(o.getDestacada())
                .imagen(o.getImagen())
                .imgW(o.getImgW())
                .imgH(o.getImgH())
                .descripcion(o.getDescripcion())
                .precio(o.getPrecio())
                .publicado(o.getPublicado())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
