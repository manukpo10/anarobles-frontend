package com.anacecilia.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckoutResponse {
    private String preferenceId;
    private String initPoint;
    private String sandboxInitPoint;
    private String externalReference;
    private boolean demo;
    private String message;
}
