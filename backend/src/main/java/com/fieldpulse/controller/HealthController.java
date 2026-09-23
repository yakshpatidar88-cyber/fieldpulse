package com.fieldpulse.controller;

import com.fieldpulse.dto.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "System", description = "System health, version, and operational heartbeat")
public class HealthController {

    private static final long START_TIME_MS = System.currentTimeMillis();

    @GetMapping
    @Operation(summary = "System health check", description = "Returns active platform status, service name, uptime, and JVM telemetry.")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        long uptimeMs = System.currentTimeMillis() - START_TIME_MS;
        Runtime runtime = Runtime.getRuntime();

        Map<String, Object> jvmStats = new LinkedHashMap<>();
        jvmStats.put("totalMemoryMb", runtime.totalMemory() / (1024 * 1024));
        jvmStats.put("freeMemoryMb", runtime.freeMemory() / (1024 * 1024));
        jvmStats.put("maxMemoryMb", runtime.maxMemory() / (1024 * 1024));
        jvmStats.put("availableProcessors", runtime.availableProcessors());

        Map<String, Object> healthInfo = new LinkedHashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("service", "FieldPulse-backend");
        healthInfo.put("version", "1.0.0");
        healthInfo.put("uptimeMs", uptimeMs);
        healthInfo.put("uptimeFormatted", formatUptime(uptimeMs));
        healthInfo.put("jvm", jvmStats);
        healthInfo.put("timestamp", Instant.now().toString());

        return ResponseEntity.ok(ApiResponse.ok("FieldPulse platform running smoothly", healthInfo));
    }

    private String formatUptime(long millis) {
        long seconds = millis / 1000;
        long s = seconds % 60;
        long m = (seconds / 60) % 60;
        long h = seconds / 3600;
        return String.format("%02dh %02dm %02ds", h, m, s);
    }
}
