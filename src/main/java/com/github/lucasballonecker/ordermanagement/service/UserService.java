package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.user.User;
import com.github.lucasballonecker.ordermanagement.dto.User.RegisterUserRequest;
import com.github.lucasballonecker.ordermanagement.dto.User.UserResponse;
import com.github.lucasballonecker.ordermanagement.repository.UserRepository;
import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository,
                       PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse register(RegisterUserRequest request) {

        if (repository.findByEmail(request.email()).isPresent()) {
            throw new BusinessException("Email already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());

        User saved = repository.save(user);

        return new UserResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole()
        );
    }
}
