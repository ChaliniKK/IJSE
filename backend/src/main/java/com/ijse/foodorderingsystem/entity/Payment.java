package com.ijse.foodorderingsystem.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @OneToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    public enum Status {
        PENDING, COMPLETED, FAILED
    }
}
