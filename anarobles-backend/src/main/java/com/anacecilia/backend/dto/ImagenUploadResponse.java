package com.anacecilia.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImagenUploadResponse {
    private String url;
    private Integer width;
    private Integer height;
}
