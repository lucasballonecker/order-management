package com.github.lucasballonecker.ordermanagement.repository;

import com.github.lucasballonecker.ordermanagement.domain.order.Order;
import com.github.lucasballonecker.ordermanagement.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUser(User user, Pageable pageable);
}
