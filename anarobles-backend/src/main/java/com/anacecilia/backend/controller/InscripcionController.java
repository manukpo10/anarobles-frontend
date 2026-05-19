package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.InscripcionResponse;
import com.anacecilia.backend.service.InscripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InscripcionController {

    private final InscripcionService inscripcionService;

    @GetMapping("/mis-cursos")
    public ResponseEntity<List<InscripcionResponse>> misCursos(Authentication auth) {
        return ResponseEntity.ok(inscripcionService.listarPorUsuario(auth.getName()));
    }

    @GetMapping("/cursos/{id}/inscripcion")
    public ResponseEntity<Map<String, Boolean>> estoyInscripto(@PathVariable Long id, Authentication auth) {
        boolean inscripto = inscripcionService.estaInscripto(auth.getName(), id);
        return ResponseEntity.ok(Map.of("inscripto", inscripto));
    }

    @PostMapping("/cursos/{id}/inscripcion")
    public ResponseEntity<Void> inscribir(@PathVariable Long id, Authentication auth) {
        inscripcionService.inscribir(auth.getName(), id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cursos/{id}/lecciones/{leccionId}/completar")
    public ResponseEntity<InscripcionResponse> completarLeccion(
            @PathVariable Long id,
            @PathVariable String leccionId,
            Authentication auth) {
        return ResponseEntity.ok(inscripcionService.marcarLeccion(auth.getName(), id, leccionId));
    }
}
