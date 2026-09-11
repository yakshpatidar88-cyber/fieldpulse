package com.opsflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * OpsFlow - Intelligent SLA-Aware Field Service Dispatch &amp; Operations Platform
 *
 * Main entry point for the Spring Boot application.
 */
@SpringBootApplication
@EnableScheduling
public class OpsFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(OpsFlowApplication.class, args);
    }
}
