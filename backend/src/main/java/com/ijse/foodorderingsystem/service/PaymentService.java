package com.ijse.foodorderingsystem.service;

import com.ijse.foodorderingsystem.entity.Order;
import com.ijse.foodorderingsystem.entity.Payment;
import com.ijse.foodorderingsystem.repository.OrderRepository;
import com.ijse.foodorderingsystem.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Initiate a mock payment
    public Payment initiatePayment(Long orderId, String paymentMethod) {
        logger.info("Initiating payment for orderId: {}, method: {}", orderId, paymentMethod);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // Check if payment already exists
        Optional<Payment> existing = paymentRepository.findByOrderId(orderId);
        if (existing.isPresent()) {
            throw new RuntimeException("Payment already exists for order: " + orderId);
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setStatus(Payment.Status.PENDING);

        Payment saved = paymentRepository.save(payment);
        logger.info("Payment created with id: {} in PENDING state", saved.getId());
        return saved;
    }

    // Confirm payment (simulate gateway callback)
    public Payment confirmPayment(Long paymentId) {
        logger.info("Confirming payment id: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        payment.setStatus(Payment.Status.COMPLETED);
        payment.setPaymentDate(LocalDateTime.now());

        // Also update the associated order status to PREPARING
        Order order = payment.getOrder();
        order.setStatus(Order.Status.PREPARING);
        orderRepository.save(order);

        logger.info("Payment {} confirmed. Order {} is now PREPARING.", paymentId, order.getId());
        return paymentRepository.save(payment);
    }

    // Fail payment
    public Payment failPayment(Long paymentId) {
        logger.info("Failing payment id: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));

        payment.setStatus(Payment.Status.FAILED);
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }
}
