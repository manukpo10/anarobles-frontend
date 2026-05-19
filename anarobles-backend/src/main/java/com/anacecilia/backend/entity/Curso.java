package com.anacecilia.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cursos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Curso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Column(nullable = false)
    private Double precio;
    
    private String imagen;
    
    private String categoria;
    
    private String duracion;
    
    private String nivel;
    
    @Column(nullable = false)
    private Boolean publicado;
    
    @Column(columnDefinition = "TEXT")
    private String contenido;
    
    @Column(columnDefinition = "TEXT")
    private String requisitos;
    
    private String instructor;
    
    @Column(name = "intro_video_url")
    private String introVideoUrl;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private String modalidad;

    @Column(name = "destacado")
    private Boolean destacado;

    @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<Modulo> modulos = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}