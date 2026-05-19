package com.anacecilia.backend.dto;

import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutRequest {
    @Builder.Default
    private List<CheckoutItemDto> items = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CheckoutItemDto {
        private Long id;
        private String tipo;
        private String titulo;
        private Double precio;
        private String imagen;
        private Integer cantidad;
    }
}
