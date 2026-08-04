package com.anacecilia.backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticuloRequest {
    private String titulo;
    private String subtitulo;
    private String resumen;
    private String categoria;
    private LocalDate fechaPublicacion;
    /** Opcional: si no viene, el servicio lo estima a partir del contenido. */
    private Integer tiempoLectura;
    private String imagenDestacada;
    private String imagenDestacadaAlt;
    private String contenido;
    private String metaDescripcion;
    private List<String> palabrasClave;
    private List<String> relacionados;
    private Boolean destacado;
    private Boolean publicado;
}
