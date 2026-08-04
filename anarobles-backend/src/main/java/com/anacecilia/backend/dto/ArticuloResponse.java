package com.anacecilia.backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * palabrasClave y relacionados salen como listas JSON reales aunque la entidad las
 * guarde separadas por comas — el formato de almacenamiento no se filtra a la API.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticuloResponse {
    private Long id;
    private String titulo;
    private String slug;
    private String subtitulo;
    private String resumen;
    private String categoria;
    private LocalDate fechaPublicacion;
    private Integer tiempoLectura;
    private String imagenDestacada;
    private String imagenDestacadaAlt;
    private String contenido;
    private String metaDescripcion;
    private List<String> palabrasClave;
    private List<String> relacionados;
    private Boolean destacado;
    private Boolean publicado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
