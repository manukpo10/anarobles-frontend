package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.ProductoRequest;
import com.anacecilia.backend.dto.ProductoResponse;
import com.anacecilia.backend.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping("/productos")
    public ResponseEntity<List<ProductoResponse>> listar() {
        return ResponseEntity.ok(productoService.listarPublicados());
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<ProductoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @GetMapping("/admin/productos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductoResponse>> listarTodos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> obtenerAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerPorIdAdmin(id));
    }

    @PostMapping("/admin/productos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> crear(@RequestBody ProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(request));
    }

    @PutMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long id, @RequestBody ProductoRequest request) {
        return ResponseEntity.ok(productoService.actualizar(id, request));
    }

    @DeleteMapping("/admin/productos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
