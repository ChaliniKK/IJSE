package com.ijse.foodorderingsystem.service;

import com.ijse.foodorderingsystem.entity.*;
import com.ijse.foodorderingsystem.repository.OrderRepository;
import com.ijse.foodorderingsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private CartService cartService;

    /**
     * Places a new order from the user's cart.
     */
    public Order placeOrder(Long userId) {
        logger.info("Placing order for userId: {}", userId);
        Cart cart = cartService.getCartByUserId(userId);

        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cannot place order: cart is empty for userId " + userId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.Status.PLACED);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getCartItems()) {
            FoodItem foodItem = cartItem.getFoodItem();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFoodItem(foodItem);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(foodItem.getPrice());
            orderItems.add(orderItem);
            total = total.add(foodItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        order.setTotalAmount(total);
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        logger.info("Order placed successfully with id: {}", savedOrder.getId());

        // Clear cart after successful order
        cartService.clearCart(userId);

        return savedOrder;
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    /**
     * Updates the status of an existing order (ADMIN only).
     */
    public Order updateOrderStatus(Long orderId, Order.Status newStatus) {
        logger.info("Updating order {} status to {}", orderId, newStatus);
        return orderRepository.findById(orderId).map(order -> {
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
    }

    public void cancelOrder(Long orderId) {
        logger.info("Cancelling order: {}", orderId);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        if (order.getStatus() == Order.Status.DELIVERED) {
            throw new RuntimeException("Cannot cancel a delivered order.");
        }
        order.setStatus(Order.Status.CANCELLED);
        orderRepository.save(order);
    }
}
