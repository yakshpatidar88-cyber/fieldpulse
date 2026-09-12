package com.opsflow.controller;

import com.opsflow.dto.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "System", description = "System health, version, and operational heartbeat")
public class HealthController {

    @GetMapping
    @Operation(summary = "System health check", description = "Returns active platform status, service name, and timestamp.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthInfo = Map.of(
                "status", "UP",
                "service", "opsflow-backend",
                "version", "1.0.0",
                "timestamp", Instant.now().toString()
        );
        return ResponseEntity.ok(ApiResponse.ok("OpsFlow platform running smoothly", healthInfo));
    }
}
