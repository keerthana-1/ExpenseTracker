package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class ExpenseDTO {

    private Long categoryId;
    private String userId;
    private String name;
    private Date date;
    private Double amount;
    private Boolean isRecurring;
}
