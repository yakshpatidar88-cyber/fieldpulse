package com.opsflow.dto.common;

import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private String path;
    private Map<String, String> validationErrors;

    @Builder.Default
    private Instant timestamp = Instant.now();
}
