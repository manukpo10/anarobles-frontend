package com.anacecilia.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orden_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenItem {

    public enum Tipo { CURSO, PRODUCTO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;

    @Column(name = "referencia_id", nullable = false)
    private Long referenciaId;

    @Column(nullable = false)
    private String titulo;

    private String imagen;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer cantidad;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orden_id", nullable = false)
    @JsonIgnore
    private Orden orden;
}
