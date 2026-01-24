package com.github.lucasballonecker.ordermanagement.controller;

import com.github.lucasballonecker.ordermanagement.dto.order.OrderResponse;
import com.github.lucasballonecker.ordermanagement.service.OrderService;
import com.github.lucasballonecker.ordermanagement.shared.enums.OrderStatus;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OrderService service;

    private OrderResponse testOrderResponse;

    @BeforeEach
    public void setUp() {
        testOrderResponse = new OrderResponse(
                1L,
                "user@example.com",
                OrderStatus.CREATED,
                new BigDecimal("150.00"),
                Instant.now(),
                List.of()
        );
    }

    private String validOrderRequestJson() {
        return """
                {
                  "items": [
                    {
                      "productId": 1,
                      "quantity": 2
                    }
                  ]
                }
                """;
    }

    private String validUpdateStatusJson() {
        return """
                {
                  "status": "PAID"
                }
                """;
    }

    private String invalidOrderRequestJson() {
        return """
                {
                  "items": []
                }
                """;
    }

    private String invalidStatusJson() {
        return """
                {
                  "status": "INVALID_STATUS"
                }
                """;
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldCreateOrderWithUserRole() throws Exception {
        when(service.create(any())).thenReturn(testOrderResponse);

        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validOrderRequestJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userEmail").value("user@example.com"))
                .andExpect(jsonPath("$.status").value("CREATED"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldForbidCreateOrderWithAdminRole() throws Exception {
        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validOrderRequestJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldReturnUnauthorizedWhenNotAuthenticated() throws Exception {
        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validOrderRequestJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldReturnBadRequestWhenInvalidBody() throws Exception {
        mockMvc.perform(post("/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidOrderRequestJson()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldFindMyOrders() throws Exception {
        mockMvc.perform(get("/orders/me"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldForbidFindMyOrdersWithAdminRole() throws Exception {
        mockMvc.perform(get("/orders/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldReturnUnauthorizedWhenFindMyOrdersNotAuthenticated() throws Exception {
        mockMvc.perform(get("/orders/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldFindAllOrders() throws Exception {
        mockMvc.perform(get("/orders"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldForbidFindAllOrdersWithUserRole() throws Exception {
        mockMvc.perform(get("/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldReturnUnauthorizedWhenFindAllOrdersNotAuthenticated() throws Exception {
        mockMvc.perform(get("/orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldFindOrderByIdWithUserRole() throws Exception {
        when(service.findById(1L)).thenReturn(testOrderResponse);

        mockMvc.perform(get("/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userEmail").value("user@example.com"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldFindOrderByIdWithAdminRole() throws Exception {
        when(service.findById(1L)).thenReturn(testOrderResponse);

        mockMvc.perform(get("/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userEmail").value("user@example.com"));
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldReturnNotFoundWhenOrderDoesNotExist() throws Exception {
        when(service.findById(99L))
                .thenThrow(new ResourceNotFoundException("Order not found"));

        mockMvc.perform(get("/orders/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void shouldReturnForbiddenWhenUserTriesToAccessOtherUsersOrder() throws Exception {
        when(service.findById(1L))
                .thenThrow(new AccessDeniedException("You cannot access this order"));

        mockMvc.perform(get("/orders/1")
                        .with(user("user@example.com").roles("USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    public void shouldReturnUnauthorizedWhenFindByIdNotAuthenticated() throws Exception {
        mockMvc.perform(get("/orders/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldUpdateOrderStatusWithAdminRole() throws Exception {
        mockMvc.perform(patch("/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validUpdateStatusJson()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldForbidUpdateOrderStatusWithUserRole() throws Exception {
        mockMvc.perform(patch("/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validUpdateStatusJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    public void shouldReturnForbiddenWhenUpdateStatusWithUserRole() throws Exception {
        mockMvc.perform(patch("/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validUpdateStatusJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void shouldReturnBadRequestWhenInvalidStatus() throws Exception {
        mockMvc.perform(patch("/orders/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidStatusJson()))
                .andExpect(status().isBadRequest());
    }
}
