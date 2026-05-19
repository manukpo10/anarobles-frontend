package com.anacecilia.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones",
       uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "curso_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @JsonIgnore
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;

    @Column(name = "lecciones_completadas", columnDefinition = "TEXT")
    private String leccionesCompletadasJson;

    @Column(name = "fecha_inscripcion")
    private LocalDateTime fechaInscripcion;

    @PrePersist
    protected void onCreate() {
        fechaInscripcion = LocalDateTime.now();
    }
}
