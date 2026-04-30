package com.ijse.foodorderingsystem.controller;

import com.ijse.foodorderingsystem.entity.Order;
import com.ijse.foodorderingsystem.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    // Place a new order from the user's cart
    @PostMapping("/place/{userId}")
    public ResponseEntity<Order> placeOrder(@PathVariable Long userId) {
        logger.info("POST /api/orders/place/{}", userId);
        return ResponseEntity.ok(orderService.placeOrder(userId));
    }

    // Get all orders for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        logger.info("GET /api/orders/user/{}", userId);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    // Get a specific order by id
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        logger.info("GET /api/orders/{}", id);
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cancel an order (customer)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id) {
        logger.info("PUT /api/orders/{}/cancel", id);
        orderService.cancelOrder(id);
        return ResponseEntity.noContent().build();
    }

    // Admin: get all orders
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getAllOrders() {
        logger.info("GET /api/orders (ADMIN)");
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Admin: update order status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        Order.Status status = Order.Status.valueOf(payload.get("status").toUpperCase());
        logger.info("PUT /api/orders/{}/status - new status: {}", id, status);
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
