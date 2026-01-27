package com.github.lucasballonecker.ordermanagement.controller;

import com.github.lucasballonecker.ordermanagement.domain.user.User;
import com.github.lucasballonecker.ordermanagement.dto.login.LoginRequest;
import com.github.lucasballonecker.ordermanagement.repository.UserRepository;
import com.github.lucasballonecker.ordermanagement.security.JwtService;
import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationManager authManager;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private JwtService jwtService;

    private final ObjectMapper mapper = new ObjectMapper();
    private final User user = new User(1L, "John", "john@example.com", "encodedPassword", Role.USER);
    private final Authentication auth = new UsernamePasswordAuthenticationToken("john@example.com", "password");

    @Test
    public void shouldLoginSuccessfully() throws Exception {
        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new LoginRequest("john@example.com", "password"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    public void shouldReturnUnauthorizedWhenInvalidCredentials() throws Exception {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(new LoginRequest("john@example.com", "wrongpassword"))))
                .andExpect(status().isUnauthorized());
    }
}
