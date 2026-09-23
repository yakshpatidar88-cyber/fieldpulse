package com.fieldpulse.service;

import com.fieldpulse.dto.auth.JwtAuthResponseDto;
import com.fieldpulse.dto.auth.LoginRequestDto;
import com.fieldpulse.dto.auth.RefreshTokenRequestDto;
import com.fieldpulse.dto.auth.UserProfileDto;

public interface AuthService {
    JwtAuthResponseDto login(LoginRequestDto loginRequest);
    JwtAuthResponseDto refreshToken(RefreshTokenRequestDto refreshTokenRequest);
    UserProfileDto getCurrentUserProfile(String email);
}
