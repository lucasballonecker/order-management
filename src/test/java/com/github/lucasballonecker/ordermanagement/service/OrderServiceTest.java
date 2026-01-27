package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.order.Order;
import com.github.lucasballonecker.ordermanagement.domain.order.OrderItem;
import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import com.github.lucasballonecker.ordermanagement.domain.user.User;
import com.github.lucasballonecker.ordermanagement.dto.order.CreateOrderRequest;
import com.github.lucasballonecker.ordermanagement.dto.order.OrderItemRequest;
import com.github.lucasballonecker.ordermanagement.dto.order.OrderResponse;
import com.github.lucasballonecker.ordermanagement.dto.order.UpdateOrderStatusRequest;
import com.github.lucasballonecker.ordermanagement.repository.OrderRepository;
import com.github.lucasballonecker.ordermanagement.repository.ProductRepository;
import com.github.lucasballonecker.ordermanagement.repository.UserRepository;
import com.github.lucasballonecker.ordermanagement.shared.enums.OrderStatus;
import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService service;

    private User testUser;
    private Product testProduct;

    @BeforeEach
    public void setUp() {
        testUser = new User(1L, "User", "user@example.com", "password", Role.USER);
        testProduct = new Product(1L, "Mouse", "Gamer", new BigDecimal("150"), true);
    }

    private void setupSecurityContext(String email) {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn(email);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void shouldCreateOrder() {
        setupSecurityContext("user@example.com");

        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(1L, 2))
        );

        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setUser(testUser);
        savedOrder.setStatus(OrderStatus.CREATED);
        savedOrder.setTotal(new BigDecimal("300"));
        savedOrder.setCreatedAt(Instant.now());
        savedOrder.setItems(List.of());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderResponse response = service.create(request);

        assertNotNull(response);
        assertEquals("user@example.com", response.userEmail());
        assertEquals(OrderStatus.CREATED, response.status());
        assertEquals(new BigDecimal("300"), response.total());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void shouldThrowExceptionWhenCreatingOrderWithNonExistentProduct() {
        setupSecurityContext("user@example.com");

        CreateOrderRequest request = new CreateOrderRequest(
                List.of(new OrderItemRequest(99L, 1))
        );

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.create(request));
    }

    @Test
    public void shouldFindAllOrders() {
        Order order = new Order();
        order.setId(1L);
        order.setUser(testUser);
        order.setStatus(OrderStatus.CREATED);
        order.setTotal(new BigDecimal("150"));
        order.setCreatedAt(Instant.now());
        order.setItems(List.of());
        
        Pageable pageable = mock(Pageable.class);
        when(orderRepository.findAll(pageable)).thenReturn(new PageImpl<>(List.of(order)));

        Page<OrderResponse> responses = service.findAll(pageable);

        assertNotNull(responses);
        assertEquals(1, responses.getContent().size());
        assertEquals("user@example.com", responses.getContent().get(0).userEmail());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void shouldFindMyOrders() {
        setupSecurityContext("user@example.com");

        Order order = new Order();
        order.setId(1L);
        order.setUser(testUser);
        order.setStatus(OrderStatus.CREATED);
        order.setTotal(new BigDecimal("150"));
        order.setCreatedAt(Instant.now());
        order.setItems(List.of());
        
        Pageable pageable = mock(Pageable.class);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
        when(orderRepository.findByUser(testUser, pageable)).thenReturn(new PageImpl<>(List.of(order)));

        Page<OrderResponse> responses = service.findMyOrders(pageable);

        assertNotNull(responses);
        assertEquals(1, responses.getContent().size());
        assertEquals("user@example.com", responses.getContent().get(0).userEmail());
    }

    @Test
    @WithMockUser(username = "admin@example.com")
    public void shouldFindOrderByIdWithAdminRole() {
        setupSecurityContext("admin@example.com");

        User admin = new User(1L, "Admin", "admin@example.com", "password", Role.ADMIN);
        User user = new User(2L, "User", "user@example.com", "password", Role.USER);
        Order order = new Order();
        order.setId(1L);
        order.setUser(user);
        order.setStatus(OrderStatus.CREATED);
        order.setTotal(new BigDecimal("150"));
        order.setCreatedAt(Instant.now());
        order.setItems(List.of());

        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(admin));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        OrderResponse response = service.findById(1L);

        assertNotNull(response);
        assertEquals("user@example.com", response.userEmail());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void shouldFindOrderByIdWhenUserOwnsOrder() {
        setupSecurityContext("user@example.com");

        Order order = new Order();
        order.setId(1L);
        order.setUser(testUser);
        order.setStatus(OrderStatus.CREATED);
        order.setTotal(new BigDecimal("150"));
        order.setCreatedAt(Instant.now());
        order.setItems(List.of());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        OrderResponse response = service.findById(1L);

        assertNotNull(response);
        assertEquals("user@example.com", response.userEmail());
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void shouldThrowExceptionWhenUserTriesToAccessOtherUsersOrder() {
        setupSecurityContext("user@example.com");

        User otherUser = new User(2L, "Other User", "other@example.com", "password", Role.USER);
        Order order = new Order();
        order.setId(1L);
        order.setUser(otherUser);
        order.setStatus(OrderStatus.CREATED);
        order.setTotal(new BigDecimal("150"));
        order.setCreatedAt(Instant.now());
        order.setItems(List.of());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(testUser));
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(AccessDeniedException.class, () -> service.findById(1L));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    public void shouldThrowExceptionWhenOrderNotFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    @Test
    public void shouldUpdateOrderStatus() {
        Order order = new Order();
        order.setId(1L);
        order.setStatus(OrderStatus.CREATED);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest("PAID");
        service.updateStatus(1L, request);

        assertEquals(OrderStatus.PAID, order.getStatus());
    }

    @Test
    public void shouldThrowExceptionWhenUpdatingStatusOfNonExistentOrder() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest("PAID");

        assertThrows(ResourceNotFoundException.class, () -> service.updateStatus(99L, request));
    }
}
