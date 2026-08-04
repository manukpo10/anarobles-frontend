package com.anacecilia.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "obras")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Obra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private String tecnica;

    private String dimensiones;

    @Column(nullable = false)
    private String disponibilidad;

    @Column(nullable = false)
    private Boolean destacada;

    @Column(nullable = false)
    private String imagen;

    @Column(name = "img_w", nullable = false)
    private Integer imgW;

    @Column(name = "img_h", nullable = false)
    private Integer imgH;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Double precio;

    @Column(nullable = false)
    private Boolean publicado;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (disponibilidad == null) disponibilidad = "disponible";
        if (destacada == null) destacada = false;
        if (publicado == null) publicado = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
