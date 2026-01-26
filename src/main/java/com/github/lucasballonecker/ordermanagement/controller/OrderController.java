package com.github.lucasballonecker.ordermanagement.controller;


import com.github.lucasballonecker.ordermanagement.dto.order.CreateOrderRequest;
import com.github.lucasballonecker.ordermanagement.dto.order.OrderResponse;
import com.github.lucasballonecker.ordermanagement.dto.order.UpdateOrderStatusRequest;
import com.github.lucasballonecker.ordermanagement.service.OrderService;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    public Page<OrderResponse> findMyOrders(@ParameterObject Pageable pageable) {
        return service.findMyOrders(pageable);
    }


    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<OrderResponse> findAll(@ParameterObject Pageable pageable) {
        return service.findAll(pageable);
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

