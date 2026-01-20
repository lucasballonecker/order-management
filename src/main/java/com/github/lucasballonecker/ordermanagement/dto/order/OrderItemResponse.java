package com.github.lucasballonecker.ordermanagement.dto.order;

import java.math.BigDecimal;

public record OrderItemResponse(String productName,
                                Integer quantity,
                                BigDecimal priceAtMoment
) {
}
