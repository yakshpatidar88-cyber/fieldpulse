package com.fieldpulse.security;

import com.fieldpulse.domain.entity.Role;
import com.fieldpulse.domain.entity.User;
import com.fieldpulse.domain.enums.RoleType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserPrincipalTest {

    @Test
    @DisplayName("Should correctly adapt User entity into Spring Security UserDetails")
    void testUserPrincipalCreation() {
        Role role = new Role(2L, RoleType.ROLE_DISPATCHER);
        User user = new User();
        user.setId(10L);
        user.setEmail("test.dispatcher@fieldpulse.io");
        user.setPasswordHash("$2a$10$hashedpassword");
        user.setFirstName("Sarah");
        user.setLastName("Jenkins");
        user.setActive(true);
        user.setRoles(Set.of(role));

        UserPrincipal principal = UserPrincipal.create(user);

        assertEquals(10L, principal.getId());
        assertEquals("test.dispatcher@fieldpulse.io", principal.getUsername());
        assertEquals("$2a$10$hashedpassword", principal.getPassword());
        assertEquals("Sarah", principal.getFirstName());
        assertEquals("Jenkins", principal.getLastName());
        assertTrue(principal.isEnabled());
        assertTrue(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DISPATCHER")));
    }
}
