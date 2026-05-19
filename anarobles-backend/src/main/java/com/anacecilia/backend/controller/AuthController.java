package com.anacecilia.backend.controller;

import com.anacecilia.backend.dto.AuthResponse;
import com.anacecilia.backend.dto.LoginRequest;
import com.anacecilia.backend.dto.RegistroRequest;
import com.anacecilia.backend.dto.UsuarioResponse;
import com.anacecilia.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/registrar")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request) {
        return ResponseEntity.ok(authService.registrar(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @GetMapping("/yo")
    public ResponseEntity<UsuarioResponse> obtenerUsuarioActual(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(authService.obtenerUsuarioActual(userDetails.getUsername()));
    }
}