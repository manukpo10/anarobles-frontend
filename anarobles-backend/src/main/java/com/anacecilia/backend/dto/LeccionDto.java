package com.anacecilia.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeccionDto {
    private Long id;
    private String titulo;
    private String duracion;
    private String tipo;
    private String videoUrl;
    private String pdfUrl;
    private String quizJson;
    private Integer orden;
}
