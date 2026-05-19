package com.anacecilia.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "modulos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "orden")
    private Integer orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    @JsonIgnore
    private Curso curso;

    @OneToMany(mappedBy = "modulo", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<Leccion> lecciones = new ArrayList<>();
}
