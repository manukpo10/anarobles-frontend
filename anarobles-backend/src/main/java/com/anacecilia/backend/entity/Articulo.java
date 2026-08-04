package com.anacecilia.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Artículo del blog. Refleja el tipo `Articulo` de lib/articulos.ts en el frontend.
 *
 * palabrasClave y relacionados se guardan como TEXT separado por comas en vez de
 * @ElementCollection: son listas cortas que siempre se leen junto con el artículo,
 * y una tabla aparte sumaría un join por consulta sobre un pool de conexiones de
 * tamaño 1 (límite del pooler de Supabase). El costo es que una palabra clave no
 * puede contener una coma, lo cual no aplica a keywords ni a slugs.
 */
@Entity
@Table(name = "articulos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Articulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, unique = true)
    private String slug;

    private String subtitulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String resumen;

    @Column(nullable = false)
    private String categoria;

    @Column(name = "fecha_publicacion", nullable = false)
    private LocalDate fechaPublicacion;

    @Column(name = "tiempo_lectura", nullable = false)
    private Integer tiempoLectura;

    @Column(name = "imagen_destacada", nullable = false)
    private String imagenDestacada;

    @Column(name = "imagen_destacada_alt")
    private String imagenDestacadaAlt;

    /** Cuerpo del artículo en Markdown — lo renderiza react-markdown en el frontend. */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "meta_descripcion", columnDefinition = "TEXT")
    private String metaDescripcion;

    /** Separado por comas. Ver nota de clase. */
    @Column(name = "palabras_clave", columnDefinition = "TEXT")
    private String palabrasClave;

    /** Slugs de otros artículos, separados por comas. Ver nota de clase. */
    @Column(columnDefinition = "TEXT")
    private String relacionados;

    @Column(nullable = false)
    private Boolean destacado;

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
        if (destacado == null) destacado = false;
        if (publicado == null) publicado = true;
        if (fechaPublicacion == null) fechaPublicacion = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
