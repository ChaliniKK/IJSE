package com.ijse.foodorderingsystem.repository;

import com.ijse.foodorderingsystem.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT o FROM Order o WHERE o.user.id = :userId")
    List<Order> findByUser_Id(@org.springframework.data.repository.query.Param("userId") Long userId);
}
