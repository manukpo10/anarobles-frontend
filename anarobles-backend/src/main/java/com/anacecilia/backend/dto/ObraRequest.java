package com.anacecilia.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObraRequest {
    private String titulo;
    private String categoria;
    private Integer anio;
    private String tecnica;
    private String dimensiones;
    private String disponibilidad;
    private Boolean destacada;
    private String imagen;
    private Integer imgW;
    private Integer imgH;
    private String descripcion;
    private Double precio;
    private Boolean publicado;
}
