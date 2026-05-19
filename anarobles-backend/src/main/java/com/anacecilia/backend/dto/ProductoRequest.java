package com.anacecilia.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoRequest {
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;
    private String categoria;
    private Boolean destacado;
    private Boolean publicado;
    private Integer stock;
}
