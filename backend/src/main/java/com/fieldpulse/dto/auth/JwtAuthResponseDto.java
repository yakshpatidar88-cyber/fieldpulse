package com.fieldpulse.dto.auth;

public class JwtAuthResponseDto {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserProfileDto user;

    public JwtAuthResponseDto() {}

    public JwtAuthResponseDto(String accessToken, String refreshToken, String tokenType, long expiresIn, UserProfileDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }

    public UserProfileDto getUser() { return user; }
    public void setUser(UserProfileDto user) { this.user = user; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final JwtAuthResponseDto dto = new JwtAuthResponseDto();

        public Builder accessToken(String token) { dto.setAccessToken(token); return this; }
        public Builder refreshToken(String token) { dto.setRefreshToken(token); return this; }
        public Builder tokenType(String type) { dto.setTokenType(type); return this; }
        public Builder expiresIn(long expiry) { dto.setExpiresIn(expiry); return this; }
        public Builder user(UserProfileDto user) { dto.setUser(user); return this; }
        public JwtAuthResponseDto build() { return dto; }
    }
}
