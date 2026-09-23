package com.fieldpulse.service;

import com.fieldpulse.dto.auth.UserProfileDto;

import java.util.List;

public interface UserService {
    UserProfileDto getUserById(Long id);
    UserProfileDto getUserByEmail(String email);
    List<UserProfileDto> getAllUsers();
}
