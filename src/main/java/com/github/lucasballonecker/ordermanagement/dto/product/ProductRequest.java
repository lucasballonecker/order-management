package com.github.lucasballonecker.ordermanagement.dto.product;

import java.math.BigDecimal;

public record ProductRequest(String name, String description, BigDecimal price) {
}
