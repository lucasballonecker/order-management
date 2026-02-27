package com.github.lucasballonecker.ordermanagement.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ProductRequest(@NotBlank String name,
                             String description,
                             @NotNull @Positive BigDecimal price) {
}
