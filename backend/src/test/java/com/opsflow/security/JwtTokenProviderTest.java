package com.opsflow.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long accessTokenExpirationMs = 3600000; // 1 hour
    private final long refreshTokenExpirationMs = 86400000; // 1 day

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(secret, accessTokenExpirationMs, refreshTokenExpirationMs);
    }

    @Test
    @DisplayName("Should generate valid JWT access token and extract claims")
    void testGenerateAndValidateToken() {
        String email = "dispatcher.sarah@opsflow.io";
        Long userId = 2L;
        List<String> roles = List.of("ROLE_DISPATCHER");

        String token = tokenProvider.generateAccessToken(email, userId, roles);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(email, tokenProvider.getEmailFromToken(token));
        assertEquals(userId, tokenProvider.getUserIdFromToken(token));
    }

    @Test
    @DisplayName("Should generate valid refresh token")
    void testGenerateRefreshToken() {
        String email = "tech.marcus@opsflow.io";
        String refreshToken = tokenProvider.generateRefreshToken(email);

        assertNotNull(refreshToken);
        assertTrue(tokenProvider.validateToken(refreshToken));
        assertEquals(email, tokenProvider.getEmailFromToken(refreshToken));
    }

    @Test
    @DisplayName("Should reject malformed or tampered token")
    void testMalformedToken() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload";
        assertFalse(tokenProvider.validateToken(invalidToken));
    }

    @Test
    @DisplayName("Should reject empty or null token")
    void testEmptyToken() {
        assertFalse(tokenProvider.validateToken(""));
        assertFalse(tokenProvider.validateToken(null));
    }
}
