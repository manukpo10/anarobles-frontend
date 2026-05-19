package com.anacecilia.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;
    private String categoria;
    private Boolean destacado;
    private Boolean publicado;
    private Integer stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
