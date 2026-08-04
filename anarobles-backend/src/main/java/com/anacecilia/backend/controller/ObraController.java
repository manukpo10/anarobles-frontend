package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.ImagenUploadResponse;
import com.anacecilia.backend.dto.ObraRequest;
import com.anacecilia.backend.dto.ObraResponse;
import com.anacecilia.backend.service.ObraService;
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
public class ObraController {

    private final ObraService obraService;
    private final SupabaseStorageService supabaseStorageService;

    @GetMapping("/obras")
    public ResponseEntity<List<ObraResponse>> listar() {
        return ResponseEntity.ok(obraService.listarPublicadas());
    }

    @GetMapping("/obras/{id}")
    public ResponseEntity<ObraResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(obraService.obtenerPorId(id));
    }

    @GetMapping("/admin/obras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ObraResponse>> listarTodas() {
        return ResponseEntity.ok(obraService.listarTodas());
    }

    @GetMapping("/admin/obras/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ObraResponse> obtenerAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(obraService.obtenerPorIdAdmin(id));
    }

    @PostMapping("/admin/obras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ObraResponse> crear(@RequestBody ObraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(obraService.crear(request));
    }

    @PutMapping("/admin/obras/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ObraResponse> actualizar(@PathVariable Long id, @RequestBody ObraRequest request) {
        return ResponseEntity.ok(obraService.actualizar(id, request));
    }

    @DeleteMapping("/admin/obras/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        obraService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/obras/upload-imagen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImagenUploadResponse> subirImagen(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(supabaseStorageService.subirImagen(file));
    }
}
