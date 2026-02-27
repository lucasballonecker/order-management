package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.user.User;
import com.github.lucasballonecker.ordermanagement.dto.User.RegisterUserRequest;
import com.github.lucasballonecker.ordermanagement.dto.User.UserResponse;
import com.github.lucasballonecker.ordermanagement.repository.UserRepository;
import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.BusinessException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService service;

    private final RegisterUserRequest request = new RegisterUserRequest("John", "john@example.com", "password", Role.USER);
    private final User savedUser = new User(1L, "John", "john@example.com", "encodedPassword", Role.USER);

    @Test
    public void shouldRegisterUser() {
        when(repository.findByEmail("john@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(repository.save(any(User.class))).thenReturn(savedUser);

        UserResponse response = service.register(request);

        assertNotNull(response);
        assertEquals("John", response.name());
        assertEquals("john@example.com", response.email());
        assertEquals(Role.USER, response.role());
    }

    @Test
    public void shouldThrowExceptionWhenEmailAlreadyExists() {
        when(repository.findByEmail("john@example.com")).thenReturn(Optional.of(savedUser));

        BusinessException exception = assertThrows(BusinessException.class, () -> service.register(request));
        assertEquals("Email already registered", exception.getMessage());
    }
}
