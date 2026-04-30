package com.ijse.foodorderingsystem.service;

import com.ijse.foodorderingsystem.entity.Category;
import com.ijse.foodorderingsystem.entity.FoodItem;
import com.ijse.foodorderingsystem.repository.CategoryRepository;
import com.ijse.foodorderingsystem.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    public List<FoodItem> getAvailableFoodItems() {
        return foodItemRepository.findByStatus(FoodItem.Status.AVAILABLE);
    }

    public List<FoodItem> getFoodItemsByCategory(Long categoryId) {
        return foodItemRepository.findByCategoryId(categoryId);
    }

    public Optional<FoodItem> getFoodItemById(Long id) {
        return foodItemRepository.findById(id);
    }

    public FoodItem createFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    public FoodItem updateFoodItem(Long id, FoodItem updatedItem) {
        return foodItemRepository.findById(id).map(item -> {
            item.setName(updatedItem.getName());
            item.setDescription(updatedItem.getDescription());
            item.setPrice(updatedItem.getPrice());
            item.setImageUrl(updatedItem.getImageUrl());
            item.setStatus(updatedItem.getStatus());
            if (updatedItem.getCategory() != null) {
                Category category = categoryRepository.findById(updatedItem.getCategory().getId())
                        .orElseThrow(() -> new RuntimeException("Category not found"));
                item.setCategory(category);
            }
            return foodItemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Food item not found with id: " + id));
    }

    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }
}
