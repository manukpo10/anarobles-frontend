package com.anacecilia.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenItemDto {
    private Long id;
    private String tipo;
    private Long referenciaId;
    private String titulo;
    private String imagen;
    private Double precio;
    private Integer cantidad;
}
