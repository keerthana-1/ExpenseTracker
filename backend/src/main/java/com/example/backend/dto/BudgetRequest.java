package com.example.backend.dto;

import lombok.Data;

@Data
public class BudgetRequest {
    private String email;
    private String budgetName;
    private double currentSpending;
    private double budgetLimit;


}
