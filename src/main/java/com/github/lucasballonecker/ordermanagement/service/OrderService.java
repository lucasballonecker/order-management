package com.github.lucasballonecker.ordermanagement.service;

import com.github.lucasballonecker.ordermanagement.domain.order.Order;
import com.github.lucasballonecker.ordermanagement.domain.order.OrderItem;
import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import com.github.lucasballonecker.ordermanagement.domain.user.User;
import com.github.lucasballonecker.ordermanagement.dto.order.*;
import com.github.lucasballonecker.ordermanagement.repository.OrderRepository;
import com.github.lucasballonecker.ordermanagement.repository.ProductRepository;
import com.github.lucasballonecker.ordermanagement.repository.UserRepository;
import com.github.lucasballonecker.ordermanagement.shared.enums.OrderStatus;
import com.github.lucasballonecker.ordermanagement.shared.enums.Role;
import com.github.lucasballonecker.ordermanagement.shared.exceptions.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }


    public OrderResponse create(CreateOrderRequest request) {
        User user = getAuthenticatedUser();

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CREATED);
        order.setCreatedAt(Instant.now());

        List<OrderItem> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.items()) {
            Product product = productRepository.findById(itemRequest.productId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Product not found"));

            BigDecimal itemTotal =
                    product.getPrice()
                            .multiply(BigDecimal.valueOf(itemRequest.quantity()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemRequest.quantity());
            item.setPriceAtMoment(product.getPrice());

            items.add(item);
            total = total.add(itemTotal);
        }

        order.setTotal(total);
        order.setItems(items);

        Order saved = orderRepository.save(order);

        return toResponse(saved);
    }


    public Page<OrderResponse> findAll(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(this::toResponse);
    }


    public Page<OrderResponse> findMyOrders(Pageable pageable) {
        User user = getAuthenticatedUser();

        return orderRepository.findByUser(user, pageable)
                .map(this::toResponse);
    }


    public OrderResponse findById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));

        User user = getAuthenticatedUser();

        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isAdmin && !order.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You cannot access this order");
        }

        return toResponse(order);
    }


    private User getAuthenticatedUser() {
        String email =
                SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private OrderResponse toResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getUser().getEmail(),
                order.getStatus(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getItems().stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getProduct().getName(),
                                        item.getQuantity(),
                                        item.getPriceAtMoment()
                                ))
                        .toList()
        );
    }

    @Transactional
    public void updateStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setStatus(request.status());
    }
}

