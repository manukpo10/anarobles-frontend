package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.CheckoutRequest;
import com.anacecilia.backend.dto.CheckoutResponse;
import com.anacecilia.backend.dto.OrdenResponse;
import com.anacecilia.backend.entity.Orden;
import com.anacecilia.backend.repository.OrdenRepository;
import com.anacecilia.backend.service.MercadoPagoService;
import com.anacecilia.backend.service.OrdenService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {

    private final OrdenService ordenService;
    private final MercadoPagoService mpService;
    private final OrdenRepository ordenRepository;

    @PostMapping("/checkout/preference")
    public ResponseEntity<CheckoutResponse> crearPreferencia(
            @RequestBody CheckoutRequest request,
            Authentication auth) throws Exception {

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("No hay items en el checkout");
        }

        String externalRef = "ORD-" + System.currentTimeMillis() + "-"
                + UUID.randomUUID().toString().substring(0, 8);

        Orden orden = ordenService.crearOrden(auth.getName(), request, externalRef);

        MercadoPagoService.PreferenciaResultado pref = mpService.crearPreferencia(orden);
        if (pref.preferenceId() != null) {
            ordenService.actualizarPreferenceId(orden.getId(), pref.preferenceId());
        }

        return ResponseEntity.ok(CheckoutResponse.builder()
                .preferenceId(pref.preferenceId())
                .initPoint(pref.initPoint())
                .sandboxInitPoint(pref.sandboxInitPoint())
                .externalReference(externalRef)
                .demo(pref.demo())
                .message(pref.demo() ? "Mercado Pago no configurado: usando modo demo" : null)
                .build());
    }

    @PostMapping("/checkout/webhook")
    public ResponseEntity<Void> webhook(
            @RequestBody(required = false) Map<String, Object> body,
            @RequestParam(required = false) String topic,
            @RequestParam(name = "data.id", required = false) String dataId,
            @RequestParam(name = "id", required = false) String id) {
        try {
            String type = body != null ? String.valueOf(body.getOrDefault("type", topic)) : topic;
            String paymentId = dataId != null ? dataId : id;
            if (paymentId == null && body != null) {
                Object data = body.get("data");
                if (data instanceof Map<?, ?> dataMap) {
                    Object pid = dataMap.get("id");
                    if (pid != null) paymentId = pid.toString();
                }
            }

            log.info("Webhook MP recibido: type={}, paymentId={}", type, paymentId);
            if (paymentId == null) return ResponseEntity.ok().build();

            JsonNode pago = mpService.consultarPago(paymentId);
            if (pago == null) return ResponseEntity.ok().build();

            String status = pago.path("status").asText("");
            String externalRef = pago.path("external_reference").asText(null);
            if (externalRef == null) return ResponseEntity.ok().build();

            final String finalPaymentId = paymentId;
            ordenRepository.findByExternalReference(externalRef).ifPresent(orden -> {
                if ("approved".equalsIgnoreCase(status)) {
                    ordenService.marcarComoPagada(orden.getId(), finalPaymentId, null);
                } else if ("rejected".equalsIgnoreCase(status) || "cancelled".equalsIgnoreCase(status)) {
                    ordenService.marcarComoFallida(orden.getId(), finalPaymentId);
                }
            });
        } catch (Exception e) {
            log.error("Error procesando webhook", e);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout/confirm-demo")
    public ResponseEntity<OrdenResponse> confirmarDemo(
            @RequestBody Map<String, String> body,
            Authentication auth) {
        String externalRef = body.get("externalReference");
        Orden orden = ordenRepository.findByExternalReference(externalRef)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        if (!orden.getUsuario().getEmail().equals(auth.getName())) {
            throw new RuntimeException("No autorizado");
        }
        ordenService.marcarComoPagada(orden.getId(), "DEMO-" + System.currentTimeMillis(), null);
        return ResponseEntity.ok(ordenService.toResponse(
                ordenRepository.findById(orden.getId()).get()));
    }

    @GetMapping("/mis-ordenes")
    public ResponseEntity<List<OrdenResponse>> misOrdenes(Authentication auth) {
        return ResponseEntity.ok(ordenService.listarPorUsuario(auth.getName()));
    }

    @GetMapping("/ordenes/external/{externalReference}")
    public ResponseEntity<OrdenResponse> obtenerPorRef(@PathVariable String externalReference) {
        return ResponseEntity.ok(ordenService.obtenerPorExternalReference(externalReference));
    }
}
