package com.github.lucasballonecker.ordermanagement.dto.order;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateOrderRequest(@NotEmpty List<OrderItemRequest> items) {

}
