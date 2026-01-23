package com.github.lucasballonecker.ordermanagement.dto.order;

import com.github.lucasballonecker.ordermanagement.shared.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(@NotNull OrderStatus status) {
}
