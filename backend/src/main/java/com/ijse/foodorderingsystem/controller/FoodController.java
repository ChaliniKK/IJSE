package com.ijse.foodorderingsystem.controller;

import com.ijse.foodorderingsystem.entity.FoodItem;
import com.ijse.foodorderingsystem.service.FoodItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    private static final Logger logger = LoggerFactory.getLogger(FoodController.class);

    @Autowired
    private FoodItemService foodItemService;

    // Public: browse all or available food items
    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        logger.info("GET /api/food");
        return ResponseEntity.ok(foodItemService.getAllFoodItems());
    }

    @GetMapping("/available")
    public ResponseEntity<List<FoodItem>> getAvailableFoodItems() {
        logger.info("GET /api/food/available");
        return ResponseEntity.ok(foodItemService.getAvailableFoodItems());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FoodItem>> getFoodByCategory(@PathVariable Long categoryId) {
        logger.info("GET /api/food/category/{}", categoryId);
        return ResponseEntity.ok(foodItemService.getFoodItemsByCategory(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodItemById(@PathVariable Long id) {
        logger.info("GET /api/food/{}", id);
        return foodItemService.getFoodItemById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin only: create, update, delete
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItem> createFoodItem(@RequestBody FoodItem foodItem) {
        logger.info("POST /api/food - name: {}", foodItem.getName());
        return ResponseEntity.ok(foodItemService.createFoodItem(foodItem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FoodItem> updateFoodItem(@PathVariable Long id, @RequestBody FoodItem foodItem) {
        logger.info("PUT /api/food/{}", id);
        return ResponseEntity.ok(foodItemService.updateFoodItem(id, foodItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        logger.info("DELETE /api/food/{}", id);
        foodItemService.deleteFoodItem(id);
        return ResponseEntity.noContent().build();
    }
}
