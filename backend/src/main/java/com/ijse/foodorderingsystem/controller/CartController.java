package com.ijse.foodorderingsystem.controller;

import com.ijse.foodorderingsystem.entity.Cart;
import com.ijse.foodorderingsystem.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("isAuthenticated()")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        logger.info("GET /api/cart/{}", userId);
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<Cart> addItem(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> payload) {
        Long foodItemId = Long.valueOf(payload.get("foodItemId").toString());
        int quantity = Integer.parseInt(payload.get("quantity").toString());
        logger.info("POST /api/cart/{}/add - foodItem: {}, qty: {}", userId, foodItemId, quantity);
        return ResponseEntity.ok(cartService.addItemToCart(userId, foodItemId, quantity));
    }

    @PutMapping("/item/{cartItemId}")
    public ResponseEntity<Cart> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Object> payload) {
        int quantity = Integer.parseInt(payload.get("quantity").toString());
        logger.info("PUT /api/cart/item/{} - new qty: {}", cartItemId, quantity);
        return ResponseEntity.ok(cartService.updateCartItemQuantity(cartItemId, quantity));
    }

    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long cartItemId) {
        logger.info("DELETE /api/cart/item/{}", cartItemId);
        return ResponseEntity.ok(cartService.removeItemFromCart(cartItemId));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        logger.info("DELETE /api/cart/{}/clear", userId);
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
