package com.anacecilia.backend.service;

import com.anacecilia.backend.dto.*;
import com.anacecilia.backend.entity.Role;
import com.anacecilia.backend.entity.Usuario;
import com.anacecilia.backend.repository.RoleRepository;
import com.anacecilia.backend.repository.UsuarioRepository;
import com.anacecilia.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UsuarioRepository usuarioRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    
    @Transactional
    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        Role roleUser = roleRepository.findByName(Role.RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Rol USER no encontrado"));
        
        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .role(roleUser)
                .activo(true)
                .build();
        
        usuarioRepository.save(usuario);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .role(usuario.getRole().getName().name())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtils.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuarioId(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .role(usuario.getRole().getName().name())
                .build();
    }
    
    public UsuarioResponse obtenerUsuarioActual(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .telefono(usuario.getTelefono())
                .direccion(usuario.getDireccion())
                .avatar(usuario.getAvatar())
                .role(usuario.getRole().getName().name())
                .activo(usuario.getActivo())
                .build();
    }
}