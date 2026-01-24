package com.github.lucasballonecker.ordermanagement.controller;

import com.github.lucasballonecker.ordermanagement.dto.User.RegisterUserRequest;
import com.github.lucasballonecker.ordermanagement.dto.User.UserResponse;
import com.github.lucasballonecker.ordermanagement.service.UserService;
import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private final ObjectMapper mapper = new ObjectMapper();
    private final RegisterUserRequest request = new RegisterUserRequest("John", "john@example.com", "password", Role.USER);
    private final UserResponse response = new UserResponse(1L, "John", "john@example.com", Role.USER);

    @Test
    public void shouldRegisterUserSuccessfully() throws Exception {
        when(userService.register(any(RegisterUserRequest.class))).thenReturn(response);

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John"))
                .andExpect(jsonPath("$.email").value("john@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    public void shouldReturnBadRequestWhenInvalidRequest() throws Exception {
        String invalidRequest = """
                {
                    "name": "",
                    "email": "invalid-email",
                    "password": "123"
                }
                """;

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidRequest))
                .andExpect(status().isBadRequest());
    }
}
