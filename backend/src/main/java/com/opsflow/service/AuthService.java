package com.opsflow.service;

import com.opsflow.dto.auth.JwtAuthResponseDto;
import com.opsflow.dto.auth.LoginRequestDto;
import com.opsflow.dto.auth.RefreshTokenRequestDto;
import com.opsflow.dto.auth.UserProfileDto;

public interface AuthService {
    JwtAuthResponseDto login(LoginRequestDto loginRequest);
    JwtAuthResponseDto refreshToken(RefreshTokenRequestDto refreshTokenRequest);
    UserProfileDto getCurrentUserProfile(String email);
}
