package com.opsflow.service.impl;

import com.opsflow.domain.entity.Technician;
import com.opsflow.domain.entity.User;
import com.opsflow.dto.TechnicianSummaryDto;
import com.opsflow.dto.auth.UserProfileDto;
import com.opsflow.exception.ResourceNotFoundException;
import com.opsflow.repository.TechnicianRepository;
import com.opsflow.repository.UserRepository;
import com.opsflow.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final TechnicianRepository technicianRepository;

    public UserServiceImpl(UserRepository userRepository, TechnicianRepository technicianRepository) {
        this.userRepository = userRepository;
        this.technicianRepository = technicianRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::buildUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::buildUserProfile)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::buildUserProfile)
                .toList();
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
