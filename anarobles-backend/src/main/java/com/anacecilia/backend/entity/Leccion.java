package com.anacecilia.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lecciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Leccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String duracion;

    @Column(nullable = false)
    private String tipo;

    @Column(name = "video_url", columnDefinition = "TEXT")
    private String videoUrl;

    @Column(name = "pdf_url", columnDefinition = "TEXT")
    private String pdfUrl;

    @Column(name = "quiz_json", columnDefinition = "TEXT")
    private String quizJson;

    @Column(name = "orden")
    private Integer orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modulo_id", nullable = false)
    @JsonIgnore
    private Modulo modulo;
}
