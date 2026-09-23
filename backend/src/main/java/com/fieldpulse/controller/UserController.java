package com.fieldpulse.controller;

import com.fieldpulse.dto.auth.UserProfileDto;
import com.fieldpulse.dto.common.ApiResponse;
import com.fieldpulse.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "User profiles and RBAC directory")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns active user profile with associated roles and technician link.")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDto profile = userService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DISPATCHER')")
    @Operation(summary = "Get user by ID", description = "Admin/Dispatcher lookup for any user profile.")
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserById(@PathVariable Long id) {
        UserProfileDto profile = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users", description = "Admin endpoint to list all registered users.")
    public ResponseEntity<ApiResponse<List<UserProfileDto>>> getAllUsers() {
        List<UserProfileDto> list = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
