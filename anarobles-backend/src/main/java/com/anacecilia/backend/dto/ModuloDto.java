package com.anacecilia.backend.dto;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuloDto {
    private Long id;
    private String titulo;
    private Integer orden;
    @Builder.Default
    private List<LeccionDto> lecciones = new ArrayList<>();
}
