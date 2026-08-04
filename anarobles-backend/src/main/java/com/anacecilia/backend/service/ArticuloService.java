package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.ArticuloRequest;
import com.anacecilia.backend.dto.ArticuloResponse;
import com.anacecilia.backend.entity.Articulo;
import com.anacecilia.backend.repository.ArticuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticuloService {

    /** Ritmo de lectura habitual en prosa en español; se usa para estimar tiempoLectura. */
    private static final int PALABRAS_POR_MINUTO = 200;

    private final ArticuloRepository articuloRepository;

    public List<ArticuloResponse> listarPublicados() {
        return articuloRepository.findByPublicadoTrueOrderByFechaPublicacionDesc()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ArticuloResponse> listarTodos() {
        return articuloRepository.findAll()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ArticuloResponse obtenerPorSlug(String slug) {
        Articulo a = articuloRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado: " + slug));
        if (!a.getPublicado()) {
            throw new RuntimeException("Artículo no encontrado: " + slug);
        }
        return toResponse(a);
    }

    public ArticuloResponse obtenerPorIdAdmin(Long id) {
        return toResponse(articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id)));
    }

    @Transactional
    public ArticuloResponse crear(ArticuloRequest request) {
        Articulo a = Articulo.builder()
                .titulo(request.getTitulo())
                .slug(generarSlugUnico(request.getTitulo()))
                .subtitulo(request.getSubtitulo())
                .resumen(request.getResumen())
                .categoria(request.getCategoria())
                .fechaPublicacion(request.getFechaPublicacion() != null
                        ? request.getFechaPublicacion() : LocalDate.now())
                .tiempoLectura(resolverTiempoLectura(request))
                .imagenDestacada(request.getImagenDestacada())
                .imagenDestacadaAlt(request.getImagenDestacadaAlt())
                .contenido(request.getContenido())
                .metaDescripcion(request.getMetaDescripcion())
                .palabrasClave(unir(request.getPalabrasClave()))
                .relacionados(unir(request.getRelacionados()))
                .destacado(request.getDestacado() != null ? request.getDestacado() : false)
                .publicado(request.getPublicado() != null ? request.getPublicado() : true)
                .build();
        return toResponse(articuloRepository.save(a));
    }

    @Transactional
    public ArticuloResponse actualizar(Long id, ArticuloRequest request) {
        Articulo a = articuloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado con ID: " + id));
        // El slug no se regenera: es la URL pública del artículo y, a diferencia de una
        // obra, un artículo de blog acumula enlaces entrantes y posiciones en buscadores
        // que se perderían al cambiarla.
        a.setTitulo(request.getTitulo());
        a.setSubtitulo(request.getSubtitulo());
        a.setResumen(request.getResumen());
        a.setCategoria(request.getCategoria());
        if (request.getFechaPublicacion() != null) a.setFechaPublicacion(request.getFechaPublicacion());
        a.setTiempoLectura(resolverTiempoLectura(request));
        a.setImagenDestacada(request.getImagenDestacada());
        a.setImagenDestacadaAlt(request.getImagenDestacadaAlt());
        a.setContenido(request.getContenido());
        a.setMetaDescripcion(request.getMetaDescripcion());
        a.setPalabrasClave(unir(request.getPalabrasClave()));
        a.setRelacionados(unir(request.getRelacionados()));
        if (request.getDestacado() != null) a.setDestacado(request.getDestacado());
        if (request.getPublicado() != null) a.setPublicado(request.getPublicado());
        return toResponse(articuloRepository.save(a));
    }

    @Transactional
    public void eliminar(Long id) {
        if (!articuloRepository.existsById(id)) {
            throw new RuntimeException("Artículo no encontrado con ID: " + id);
        }
        articuloRepository.deleteById(id);
    }

    /**
     * Usa el valor enviado si es válido; si no, lo estima contando palabras del cuerpo.
     * Se estima en vez de exigirlo porque es un dato derivado del contenido, y pedirle
     * a quien escribe que lo calcule a mano garantiza que quede desactualizado al editar.
     */
    private Integer resolverTiempoLectura(ArticuloRequest request) {
        if (request.getTiempoLectura() != null && request.getTiempoLectura() > 0) {
            return request.getTiempoLectura();
        }
        String contenido = request.getContenido();
        if (contenido == null || contenido.isBlank()) return 1;
        int palabras = contenido.trim().split("\\s+").length;
        return Math.max(1, (int) Math.ceil((double) palabras / PALABRAS_POR_MINUTO));
    }

    private String unir(List<String> valores) {
        if (valores == null || valores.isEmpty()) return null;
        String unido = valores.stream()
                .filter(v -> v != null && !v.isBlank())
                .map(String::trim)
                .collect(Collectors.joining(","));
        return unido.isEmpty() ? null : unido;
    }

    private List<String> separar(String valor) {
        if (valor == null || valor.isBlank()) return Collections.emptyList();
        return Arrays.stream(valor.split(","))
                .map(String::trim)
                .filter(v -> !v.isEmpty())
                .collect(Collectors.toList());
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
        while (articuloRepository.existsBySlug(slug)) {
            slug = base + "-" + contador;
            contador++;
        }
        return slug;
    }

    private String generarSlugBase(String titulo) {
        // NFD descompone letras acentuadas en letra base + marca combinante, que luego se
        // elimina con \p{M}. Mismo criterio que ObraService.
        String normalizado = Normalizer.normalize(
                titulo == null ? "" : titulo.toLowerCase(), Normalizer.Form.NFD);
        String sinAcentos = normalizado.replaceAll("\\p{M}", "");
        String slug = sinAcentos.replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
        return slug.isEmpty() ? "articulo" : slug;
    }

    private ArticuloResponse toResponse(Articulo a) {
        return ArticuloResponse.builder()
                .id(a.getId())
                .titulo(a.getTitulo())
                .slug(a.getSlug())
                .subtitulo(a.getSubtitulo())
                .resumen(a.getResumen())
                .categoria(a.getCategoria())
                .fechaPublicacion(a.getFechaPublicacion())
                .tiempoLectura(a.getTiempoLectura())
                .imagenDestacada(a.getImagenDestacada())
                .imagenDestacadaAlt(a.getImagenDestacadaAlt())
                .contenido(a.getContenido())
                .metaDescripcion(a.getMetaDescripcion())
                .palabrasClave(separar(a.getPalabrasClave()))
                .relacionados(separar(a.getRelacionados()))
                .destacado(a.getDestacado())
                .publicado(a.getPublicado())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
