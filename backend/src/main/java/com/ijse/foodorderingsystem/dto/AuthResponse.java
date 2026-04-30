package com.ijse.foodorderingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String name;
    private String role;
    
    public AuthResponse(String token, Long id, String username, String name, String role) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.name = name;
        this.role = role;
    }
}
