package com.ijse.foodorderingsystem.controller;

import com.ijse.foodorderingsystem.entity.Payment;
import com.ijse.foodorderingsystem.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@PreAuthorize("isAuthenticated()")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    // Initiate a mock payment for an order
    @PostMapping("/initiate/{orderId}")
    public ResponseEntity<Payment> initiatePayment(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> payload) {
        String method = payload.getOrDefault("paymentMethod", "CARD");
        logger.info("POST /api/payments/initiate/{} - method: {}", orderId, method);
        return ResponseEntity.ok(paymentService.initiatePayment(orderId, method));
    }

    // Mock: confirm payment (simulate payment gateway success callback)
    @PutMapping("/{paymentId}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long paymentId) {
        logger.info("PUT /api/payments/{}/confirm", paymentId);
        return ResponseEntity.ok(paymentService.confirmPayment(paymentId));
    }

    // Mock: fail payment (simulate payment gateway failure)
    @PutMapping("/{paymentId}/fail")
    public ResponseEntity<Payment> failPayment(@PathVariable Long paymentId) {
        logger.info("PUT /api/payments/{}/fail", paymentId);
        return ResponseEntity.ok(paymentService.failPayment(paymentId));
    }

    // Get payment by order id
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrder(@PathVariable Long orderId) {
        logger.info("GET /api/payments/order/{}", orderId);
        return paymentService.getPaymentByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: get payment by id
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long paymentId) {
        logger.info("GET /api/payments/{}", paymentId);
        return paymentService.getPaymentById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
