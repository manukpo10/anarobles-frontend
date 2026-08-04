package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.ImagenUploadResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.Normalizer;
import java.util.Iterator;
import java.util.Set;
import java.util.UUID;

/**
 * Sube imágenes al bucket "images" (ya existente) de Supabase Storage, bajo el
 * prefijo "galeria/". No existe SDK de Supabase para Java en este proyecto, así que,
 * siguiendo la misma convención que MercadoPagoService, se llama a la API REST de
 * Storage directamente con java.net.http.HttpClient en vez de sumar una dependencia nueva.
 */
@Service
@Slf4j
public class SupabaseStorageService {

    private static final String BUCKET = "images";
    private static final Set<String> EXTENSIONES_PERMITIDAS = Set.of("png", "jpg", "gif", "bmp", "webp");

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-key}")
    private String serviceKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public ImagenUploadResponse subirImagen(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("No se recibió ningún archivo");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer el archivo recibido: " + e.getMessage());
        }

        // Dimensiones Y formato leídos server-side a partir de los bytes reales del
        // archivo (nunca del nombre/content-type que manda el cliente): el formato
        // detectado acá es también lo único que determina la extensión del path de
        // Storage, para que un nombre de archivo manipulado no pueda inyectar "/" u
        // otros caracteres en la ruta subida al bucket compartido.
        BufferedImage imagen;
        String extension;
        try (ImageInputStream iis = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            if (iis == null) {
                throw new RuntimeException("El archivo no es una imagen válida o está corrupto");
            }
            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
            if (!readers.hasNext()) {
                throw new RuntimeException("El archivo no es una imagen válida o está corrupto");
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(iis);
                extension = extensionDesdeFormato(reader.getFormatName());
                imagen = reader.read(0);
            } finally {
                reader.dispose();
            }
        } catch (IOException e) {
            throw new RuntimeException("No se pudo procesar la imagen: " + e.getMessage());
        }
        if (imagen == null) {
            throw new RuntimeException("El archivo no es una imagen válida o está corrupto");
        }
        int width = imagen.getWidth();
        int height = imagen.getHeight();

        String path = generarPath(file, extension);
        String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

        try {
            HttpResponse<String> resp = httpClient.send(
                    HttpRequest.newBuilder()
                            .uri(URI.create(supabaseUrl + "/storage/v1/object/" + BUCKET + "/" + path))
                            .header("apikey", serviceKey)
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceKey)
                            .header(HttpHeaders.CONTENT_TYPE, contentType)
                            .POST(HttpRequest.BodyPublishers.ofByteArray(bytes))
                            .build(),
                    HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() < 200 || resp.statusCode() >= 300) {
                log.error("Error al subir imagen a Supabase Storage ({}): {}", resp.statusCode(), resp.body());
                throw new RuntimeException("Error al subir la imagen a Supabase Storage: " + resp.statusCode());
            }
        } catch (IOException e) {
            log.error("Error de red al subir imagen a Supabase Storage", e);
            throw new RuntimeException("Error de conexión al subir la imagen: " + e.getMessage());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("La subida de la imagen fue interrumpida");
        }

        String url = supabaseUrl + "/storage/v1/object/public/" + BUCKET + "/" + path;
        return ImagenUploadResponse.builder()
                .url(url)
                .width(width)
                .height(height)
                .build();
    }

    private String generarPath(MultipartFile file, String extension) {
        // slugify() reduces the name to [a-z0-9-], so even a filename crafted with
        // "/" or ".." characters can't steer this segment outside "galeria/".
        String base = "";
        if (file.getOriginalFilename() != null) {
            base = slugify(file.getOriginalFilename().replaceAll("\\.[^.]+$", ""));
        }
        if (base.isEmpty()) {
            // Mismo estilo "timestamp + id corto" ya usado en CheckoutController para
            // external_reference (System.currentTimeMillis() + UUID acortado).
            base = UUID.randomUUID().toString().substring(0, 8);
        }
        return "galeria/" + System.currentTimeMillis() + "-" + base + extension;
    }

    /** Maps an ImageIO-detected format name (read from the file's actual header
     *  bytes, never from client-supplied filename/content-type) to a safe,
     *  allowlisted extension. Rejects anything not on the allowlist instead of
     *  guessing, since an unrecognized format is exactly the case an attacker
     *  would try to abuse. */
    private String extensionDesdeFormato(String formatoDetectado) {
        String formato = formatoDetectado == null ? "" : formatoDetectado.toLowerCase();
        if (formato.equals("jpeg")) {
            formato = "jpg";
        }
        if (!EXTENSIONES_PERMITIDAS.contains(formato)) {
            throw new RuntimeException("Formato de imagen no soportado: " + formatoDetectado);
        }
        return "." + formato;
    }

    private String slugify(String texto) {
        String normalizado = Normalizer.normalize(texto.toLowerCase(), Normalizer.Form.NFD);
        String sinAcentos = normalizado.replaceAll("\\p{M}", "");
        return sinAcentos.replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
    }
}
