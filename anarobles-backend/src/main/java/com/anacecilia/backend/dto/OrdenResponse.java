package com.anacecilia.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdenResponse {
    private Long id;
    private String externalReference;
    private String preferenceId;
    private String paymentId;
    private Double total;
    private String estado;
    @Builder.Default
    private List<OrdenItemDto> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
