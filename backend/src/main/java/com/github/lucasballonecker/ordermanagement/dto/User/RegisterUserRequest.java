package com.github.lucasballonecker.ordermanagement.dto.User;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterUserRequest(@NotBlank String name,
                                  @Email @NotBlank String email,
                                  @NotBlank String password) {}
