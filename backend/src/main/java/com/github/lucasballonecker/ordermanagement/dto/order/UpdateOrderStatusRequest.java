package com.github.lucasballonecker.ordermanagement.dto.order;

import jakarta.validation.constraints.NotBlank;

public record UpdateOrderStatusRequest(@NotBlank String status) {
}
