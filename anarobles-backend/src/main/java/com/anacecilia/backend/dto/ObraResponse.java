package com.anacecilia.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObraResponse {
    private Long id;
    private String titulo;
    private String slug;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
