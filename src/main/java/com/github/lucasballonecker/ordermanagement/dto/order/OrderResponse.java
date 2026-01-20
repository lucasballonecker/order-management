package com.github.lucasballonecker.ordermanagement.dto.order;

import com.github.lucasballonecker.ordermanagement.shared.enums.OrderStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(Long id,
                            String userEmail,
                            OrderStatus status,
                            BigDecimal total,
                            Instant createdAt,
                            List<OrderItemResponse> items) {
}
