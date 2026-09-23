package com.fieldpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * FieldPulse - Intelligent SLA-Aware Field Service Dispatch &amp; Operations Platform
 *
 * Main entry point for the Spring Boot application.
 */
@SpringBootApplication
@EnableScheduling
public class FieldPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(FieldPulseApplication.class, args);
    }
}
