package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class BudgetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="category_id",referencedColumnName = "id", nullable = false)
    private CategoryEntity category;
    private Double amount;

    @ManyToOne
    @JoinColumn(name="user_id",referencedColumnName = "email",nullable = false)
    private UserEntity user;

    private String month;

    private int year;

}
