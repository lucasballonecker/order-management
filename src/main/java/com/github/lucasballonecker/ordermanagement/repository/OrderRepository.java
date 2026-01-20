package com.github.lucasballonecker.ordermanagement.repository;

import com.github.lucasballonecker.ordermanagement.domain.order.Order;
import com.github.lucasballonecker.ordermanagement.domain.product.Product;
import com.github.lucasballonecker.ordermanagement.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
}
