package com.anacecilia.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InscripcionResponse {
    private Long id;
    private Long cursoId;
    private String cursoTitulo;
    private String cursoImagen;
    @Builder.Default
    private List<String> leccionesCompletadas = new ArrayList<>();
    private LocalDateTime fechaInscripcion;
}
