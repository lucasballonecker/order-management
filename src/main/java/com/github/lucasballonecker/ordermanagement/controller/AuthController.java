package com.github.lucasballonecker.ordermanagement.controller;

import com.github.lucasballonecker.ordermanagement.security.JwtService;
import com.github.lucasballonecker.ordermanagement.domain.user.User;
import com.github.lucasballonecker.ordermanagement.dto.login.LoginRequest;
import com.github.lucasballonecker.ordermanagement.dto.login.LoginResponse;
import com.github.lucasballonecker.ordermanagement.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {


    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository repository;

    public AuthController(AuthenticationManager authManager,
                          JwtService jwtService,
                          UserRepository repository) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.repository = repository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(), request.password()
                )
        );

        User user = repository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return new LoginResponse(jwtService.generateToken(user));
    }
}
