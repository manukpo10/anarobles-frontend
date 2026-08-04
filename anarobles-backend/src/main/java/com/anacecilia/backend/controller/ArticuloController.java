package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.ArticuloRequest;
import com.anacecilia.backend.dto.ArticuloResponse;
import com.anacecilia.backend.dto.ImagenUploadResponse;
import com.anacecilia.backend.service.ArticuloService;
import com.anacecilia.backend.service.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ArticuloController {

    private final ArticuloService articuloService;
    private final SupabaseStorageService supabaseStorageService;

    @GetMapping("/articulos")
    public ResponseEntity<List<ArticuloResponse>> listar() {
        return ResponseEntity.ok(articuloService.listarPublicados());
    }

    /**
     * Por slug y no por id: es como el frontend direcciona un artículo (/blog/{slug}),
     * y así generateStaticParams/generateMetadata resuelven con el mismo identificador
     * que aparece en la URL pública.
     */
    @GetMapping("/articulos/{slug}")
    public ResponseEntity<ArticuloResponse> obtenerPorSlug(@PathVariable String slug) {
        return ResponseEntity.ok(articuloService.obtenerPorSlug(slug));
    }

    @GetMapping("/admin/articulos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ArticuloResponse>> listarTodos() {
        return ResponseEntity.ok(articuloService.listarTodos());
    }

    @GetMapping("/admin/articulos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticuloResponse> obtenerAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(articuloService.obtenerPorIdAdmin(id));
    }

    @PostMapping("/admin/articulos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticuloResponse> crear(@RequestBody ArticuloRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articuloService.crear(request));
    }

    @PutMapping("/admin/articulos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticuloResponse> actualizar(@PathVariable Long id,
                                                       @RequestBody ArticuloRequest request) {
        return ResponseEntity.ok(articuloService.actualizar(id, request));
    }

    @DeleteMapping("/admin/articulos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        articuloService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /** Sube al prefijo "blog/" para no mezclar con las imágenes de obras. */
    @PostMapping("/admin/articulos/upload-imagen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImagenUploadResponse> subirImagen(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(supabaseStorageService.subirImagen(file, "blog"));
    }
}
