package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Data
public class ExpenseEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name="user_id",referencedColumnName = "email", nullable = false)
        private UserEntity user;

        @ManyToOne
        @JoinColumn(name="category_id",referencedColumnName = "id", nullable = false)
        private CategoryEntity category;
        private Double amount;
        private String name;
        private Date date;
        private boolean isRecurring;

    }

