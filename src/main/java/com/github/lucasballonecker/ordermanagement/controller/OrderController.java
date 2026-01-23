package com.github.lucasballonecker.ordermanagement.controller;


import com.github.lucasballonecker.ordermanagement.dto.order.CreateOrderRequest;
import com.github.lucasballonecker.ordermanagement.dto.order.OrderResponse;
import com.github.lucasballonecker.ordermanagement.dto.order.UpdateOrderStatusRequest;
import com.github.lucasballonecker.ordermanagement.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }


    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) {
        return service.create(request);
    }


    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public List<OrderResponse> findMyOrders() {
        return service.findMyOrders();
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponse> findAll() {
        return service.findAll();
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public OrderResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        service.updateStatus(id, request);
    }
}

