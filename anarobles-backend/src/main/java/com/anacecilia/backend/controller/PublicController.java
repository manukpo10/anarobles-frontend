package com.anacecilia.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    
    @GetMapping("/saludo")
    public ResponseEntity<Map<String, String>> saludo() {
        return ResponseEntity.ok(Map.of(
            "mensaje", "¡El backend funciona! 🎉",
            "estado", "OK",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
    
    @GetMapping("/estado")
    public ResponseEntity<Map<String, Object>> estado() {
        return ResponseEntity.ok(Map.of(
            "servidor", "AnaCecilia Backend",
            "version", "1.0.0",
            "estado", " Activo",
            "endpoints", Map.of(
                "login", "POST /api/auth/login",
                "registrar", "POST /api/auth/registrar",
                "miPerfil", "GET /api/auth/yo"
            )
        ));
    }
}