package com.opsflow.service;

import com.opsflow.dto.auth.UserProfileDto;

import java.util.List;

public interface UserService {
    UserProfileDto getUserById(Long id);
    UserProfileDto getUserByEmail(String email);
    List<UserProfileDto> getAllUsers();
}
