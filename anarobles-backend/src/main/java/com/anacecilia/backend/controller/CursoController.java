package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.CursoRequest;
import com.anacecilia.backend.dto.CursoResponse;
import com.anacecilia.backend.service.CursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CursoController {
    
    private final CursoService cursoService;
    
    // Endpoints públicos
    @GetMapping("/cursos")
    public ResponseEntity<List<CursoResponse>> listarCursos() {
        return ResponseEntity.ok(cursoService.listarCursosPublicos());
    }
    
    @GetMapping("/cursos/{id}")
    public ResponseEntity<CursoResponse> obtenerCurso(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.obtenerCursoPorId(id));
    }
    
    // Endpoints Admin
    @GetMapping("/admin/cursos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CursoResponse>> listarTodosCursos() {
        return ResponseEntity.ok(cursoService.listarTodosCursos());
    }
    
    @GetMapping("/admin/cursos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoResponse> obtenerCursoAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.obtenerCursoPorIdAdmin(id));
    }
    
    @PostMapping("/admin/cursos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoResponse> crearCurso(@RequestBody CursoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cursoService.crearCurso(request));
    }
    
    @PutMapping("/admin/cursos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoResponse> actualizarCurso(@PathVariable Long id, @RequestBody CursoRequest request) {
        return ResponseEntity.ok(cursoService.actualizarCurso(id, request));
    }
    
    @DeleteMapping("/admin/cursos/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarCurso(@PathVariable Long id) {
        cursoService.eliminarCurso(id);
        return ResponseEntity.noContent().build();
    }
}