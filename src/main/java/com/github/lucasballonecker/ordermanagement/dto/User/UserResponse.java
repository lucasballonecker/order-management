package com.github.lucasballonecker.ordermanagement.dto.User;

import com.github.lucasballonecker.ordermanagement.shared.enums.Role;

public record UserResponse(Long id,
                           String name,
                           String email,
                           Role role) {
}
