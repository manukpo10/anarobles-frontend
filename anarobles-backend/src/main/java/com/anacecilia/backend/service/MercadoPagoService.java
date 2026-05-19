package com.anacecilia.backend.service;

import com.anacecilia.backend.entity.Orden;
import com.anacecilia.backend.entity.OrdenItem;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MercadoPagoService {

    @Value("${mp.access-token:}")
    private String accessToken;

    @Value("${mp.site-url:http://localhost:3000}")
    private String siteUrl;

    @Value("${mp.backend-url:http://localhost:8080}")
    private String backendUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public boolean estaConfigurado() {
        return accessToken != null && !accessToken.isBlank();
    }

    public PreferenciaResultado crearPreferencia(Orden orden) throws Exception {
        if (!estaConfigurado()) {
            return new PreferenciaResultado(null,
                    siteUrl + "/checkout/success?order=" + orden.getExternalReference() + "&demo=true",
                    siteUrl + "/checkout/success?order=" + orden.getExternalReference() + "&demo=true",
                    true);
        }

        List<Map<String, Object>> items = new ArrayList<>();
        for (OrdenItem it : orden.getItems()) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", it.getReferenciaId().toString());
            item.put("title", it.getTitulo());
            item.put("quantity", it.getCantidad());
            item.put("unit_price", it.getPrecio());
            item.put("currency_id", "ARS");
            items.add(item);
        }

        Map<String, Object> backUrls = new HashMap<>();
        backUrls.put("success", siteUrl + "/checkout/success?order=" + orden.getExternalReference());
        backUrls.put("failure", siteUrl + "/checkout?error=payment_failed");
        backUrls.put("pending", siteUrl + "/checkout/pending?order=" + orden.getExternalReference());

        Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        body.put("external_reference", orden.getExternalReference());
        body.put("back_urls", backUrls);
        body.put("auto_return", "approved");
        body.put("notification_url", backendUrl + "/api/checkout/webhook");

        Map<String, Object> payer = new HashMap<>();
        payer.put("email", orden.getUsuario().getEmail());
        payer.put("name", orden.getUsuario().getNombre());
        body.put("payer", payer);

        String json = objectMapper.writeValueAsString(body);
        HttpResponse<String> resp = httpClient.send(
                java.net.http.HttpRequest.newBuilder()
                        .uri(URI.create("https://api.mercadopago.com/checkout/preferences"))
                        .header(HttpHeaders.CONTENT_TYPE, "application/json")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                        .POST(java.net.http.HttpRequest.BodyPublishers.ofString(json))
                        .build(),
                HttpResponse.BodyHandlers.ofString());

        if (resp.statusCode() >= 300) {
            log.error("MP preferences error {}: {}", resp.statusCode(), resp.body());
            // Si el token es inválido (403) o MP no responde, caer al modo demo
            if (resp.statusCode() == 403 || resp.statusCode() == 401) {
                log.warn("MP token inválido o denegado ({}), usando modo demo", resp.statusCode());
                return new PreferenciaResultado(null,
                        siteUrl + "/checkout/success?order=" + orden.getExternalReference() + "&demo=true",
                        siteUrl + "/checkout/success?order=" + orden.getExternalReference() + "&demo=true",
                        true);
            }
            throw new RuntimeException("Error de Mercado Pago: " + resp.statusCode());
        }

        JsonNode node = objectMapper.readTree(resp.body());
        return new PreferenciaResultado(
                node.path("id").asText(null),
                node.path("init_point").asText(null),
                node.path("sandbox_init_point").asText(null),
                false);
    }

    public JsonNode consultarPago(String paymentId) throws Exception {
        if (!estaConfigurado()) return null;
        HttpResponse<String> resp = httpClient.send(
                java.net.http.HttpRequest.newBuilder()
                        .uri(URI.create("https://api.mercadopago.com/v1/payments/" + paymentId))
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                        .GET()
                        .build(),
                HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 300) {
            log.error("MP payment fetch error {}: {}", resp.statusCode(), resp.body());
            return null;
        }
        return objectMapper.readTree(resp.body());
    }

    public record PreferenciaResultado(String preferenceId, String initPoint, String sandboxInitPoint, boolean demo) {}
}
