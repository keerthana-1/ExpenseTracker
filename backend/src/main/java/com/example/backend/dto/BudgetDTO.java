package com.example.backend.dto;

import lombok.Data;

@Data
public class BudgetDTO {
    private Long categoryId;
    private String userId;
    private String month;
    private int year;
    private Double amount;

}
