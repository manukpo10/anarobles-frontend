package com.anacecilia.backend.dto;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CursoRequest {
    private String titulo;
    private String descripcion;
    private Double precio;
    private String imagen;
    private String categoria;
    private String duracion;
    private String nivel;
    private String modalidad;
    private Boolean publicado;
    private Boolean destacado;
    private String contenido;
    private String requisitos;
    private String instructor;
    private String introVideoUrl;
    @Builder.Default
    private List<ModuloDto> modulos = new ArrayList<>();
}
