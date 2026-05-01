package com.ijse.foodorderingsystem.config;

import com.ijse.foodorderingsystem.entity.Category;
import com.ijse.foodorderingsystem.entity.FoodItem;
import com.ijse.foodorderingsystem.repository.CategoryRepository;
import com.ijse.foodorderingsystem.repository.FoodItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository, FoodItemRepository foodItemRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                Category pizza = new Category();
                pizza.setName("Pizza");
                
                Category burgers = new Category();
                burgers.setName("Burgers");
                
                Category sushi = new Category();
                sushi.setName("Sushi");
                
                categoryRepository.saveAll(Arrays.asList(pizza, burgers, sushi));

                FoodItem f1 = new FoodItem();
                f1.setName("Margherita Pizza");
                f1.setPrice(new BigDecimal("12.99"));
                f1.setDescription("Classic tomato and mozzarella");
                f1.setCategory(pizza);
                f1.setImageUrl("https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=400");
                
                FoodItem f2 = new FoodItem();
                f2.setName("Double Cheeseburger");
                f2.setPrice(new BigDecimal("15.50"));
                f2.setDescription("Juicy beef with cheddar");
                f2.setCategory(burgers);
                f2.setImageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400");

                foodItemRepository.saveAll(Arrays.asList(f1, f2));
                
                System.out.println("Database seeded with initial categories and food items.");
            }
        };
    }
}
