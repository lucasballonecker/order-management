package com.github.lucasballonecker.ordermanagement.dto.User;

import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegisterUserRequest(@NotBlank String name,
                                  @Email @NotBlank String email,
                                  @NotBlank String password,
                                  @NotNull Role role) {}
