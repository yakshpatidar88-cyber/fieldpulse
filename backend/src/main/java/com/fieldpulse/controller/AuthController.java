package com.fieldpulse.controller;

import com.fieldpulse.dto.auth.JwtAuthResponseDto;
import com.fieldpulse.dto.auth.LoginRequestDto;
import com.fieldpulse.dto.auth.RefreshTokenRequestDto;
import com.fieldpulse.dto.auth.UserProfileDto;
import com.fieldpulse.dto.common.ApiResponse;
import com.fieldpulse.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "User login, refresh tokens, and session context")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Validates credentials and returns JWT access and refresh tokens.")
    public ResponseEntity<ApiResponse<JwtAuthResponseDto>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        JwtAuthResponseDto authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.ok("Authentication successful", authResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Generates a new access token using a valid refresh token.")
    public ResponseEntity<ApiResponse<JwtAuthResponseDto>> refreshToken(@Valid @RequestBody RefreshTokenRequestDto refreshRequest) {
        JwtAuthResponseDto authResponse = authService.refreshToken(refreshRequest);
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed successfully", authResponse));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user", description = "Retrieves user profile and role details of the current caller.")
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        UserProfileDto profile = authService.getCurrentUserProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
