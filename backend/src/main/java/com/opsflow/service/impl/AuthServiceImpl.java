package com.opsflow.service.impl;

import com.opsflow.domain.entity.Technician;
import com.opsflow.domain.entity.User;
import com.opsflow.dto.TechnicianSummaryDto;
import com.opsflow.dto.auth.JwtAuthResponseDto;
import com.opsflow.dto.auth.LoginRequestDto;
import com.opsflow.dto.auth.RefreshTokenRequestDto;
import com.opsflow.dto.auth.UserProfileDto;
import com.opsflow.exception.BusinessValidationException;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.TechnicianRepository;
import com.opsflow.repository.UserRepository;
import com.opsflow.security.JwtTokenProvider;
import com.opsflow.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           JwtTokenProvider tokenProvider,
                           UserRepository userRepository,
                           TechnicianRepository technicianRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.technicianRepository = technicianRepository;
    }

    @Override
    public JwtAuthResponseDto login(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(loginRequest.getEmail());

        UserProfileDto userProfile = getCurrentUserProfile(loginRequest.getEmail());

        return JwtAuthResponseDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessTokenExpirationMs() / 1000)
                .user(userProfile)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public JwtAuthResponseDto refreshToken(RefreshTokenRequestDto refreshTokenRequest) {
        String token = refreshTokenRequest.getRefreshToken();
        if (!tokenProvider.validateToken(token)) {
            throw new BusinessValidationException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        String newAccessToken = tokenProvider.generateAccessToken(email, user.getId(), roles);
        String newRefreshToken = tokenProvider.generateRefreshToken(email);

        UserProfileDto userProfile = buildUserProfile(user);

        return JwtAuthResponseDto.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessTokenExpirationMs() / 1000)
                .user(userProfile)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return buildUserProfile(user);
    }

    private UserProfileDto buildUserProfile(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        TechnicianSummaryDto techDto = null;
        Optional<Technician> techOpt = technicianRepository.findByUserId(user.getId());
        if (techOpt.isPresent()) {
            Technician t = techOpt.get();
            techDto = TechnicianSummaryDto.builder()
                    .id(t.getId())
                    .fullName(user.getFirstName() + " " + user.getLastName())
                    .employeeCode(t.getEmployeeCode())
                    .status(t.getStatus())
                    .activeJobsCount(t.getActiveJobsCount())
                    .maxConcurrentJobs(t.getMaxConcurrentJobs())
                    .rating(t.getRating())
                    .currentLatitude(t.getCurrentLatitude())
                    .currentLongitude(t.getCurrentLongitude())
                    .build();
        }

        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .roles(roleNames)
                .technicianProfile(techDto)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
