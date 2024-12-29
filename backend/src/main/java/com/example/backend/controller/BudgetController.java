package com.example.backend.controller;

import com.example.backend.dto.BudgetRequest;
import com.example.backend.models.BudgetEntity;
import com.example.backend.dto.BudgetDTO;
import com.example.backend.models.CategoryEntity;
import com.example.backend.models.UserEntity;
import com.example.backend.service.BudgetService;
import com.example.backend.service.CategoryService;
import com.example.backend.service.EmailNotificationService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    @Autowired
    private EmailNotificationService emailService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UserService userService;

    @GetMapping("/getAllBudgets")
    public List<BudgetEntity> getAllBudgets(){
        return budgetService.getAllBudgets();
    }

    @GetMapping("/getUserBudgets/{email}")
    public List<BudgetEntity> getBudgetByUser(@PathVariable String email){
        return budgetService.getBudgetByUser(email);
    }

    @GetMapping("/getBudgetByCategoryForUser/{email}/{category}")
    public Optional<BudgetEntity> getBudgetByCategoryForUser(String email, String category){
        return budgetService.getBudgetByCategoryForUser(email,category);
    }

    @GetMapping("/getBudgetByID/{id}")
    public Optional<BudgetEntity> getBudgetById(@PathVariable Long id){
       // System.out.println(id);
        return budgetService.getBudgetById(id);
    }


    @PostMapping("/createBudget")
    public void createBudget(@RequestBody BudgetDTO budgetDto) {
        // Fetch the CategoryEntity based on the categoryId
        CategoryEntity category = categoryService.getCategoryById(budgetDto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found for id: " + budgetDto.getCategoryId()));

        // Fetch the UserEntity based on the userId
        UserEntity user = userService.getUserById(budgetDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for email: " + budgetDto.getUserId()));

        // Map DTO to Entity
        BudgetEntity budget = new BudgetEntity();
        budget.setCategory(category);
        budget.setUser(user);
        budget.setMonth(budgetDto.getMonth());
        budget.setYear(budgetDto.getYear());
        budget.setAmount(budgetDto.getAmount());

        // Save the BudgetEntity
        budgetService.createBudget(budget);
    }

    @PutMapping("/updateBudget/{id}")
    public void updateBudget(@RequestBody BudgetDTO budgetDto,@PathVariable Long id){

        budgetService.updateBudget(id,budgetDto);
    }

    @DeleteMapping("/deleteBudget/{id}")
    public void deleteBudgetById(@PathVariable Long id){
        budgetService.deleteBudgetById(id);
    }

    @PostMapping("/track-budget")
    public String trackBudget(@RequestBody BudgetRequest budgetRequest) {
        double currentSpending = budgetRequest.getCurrentSpending();
        double budgetLimit = budgetRequest.getBudgetLimit();

        if (currentSpending > budgetLimit) {
            emailService.sendBudgetExceededEmail(
                    budgetRequest.getEmail(),
                    budgetRequest.getBudgetName(),
                    currentSpending,
                    budgetLimit
            );
            return "Budget exceeded. Email notification sent.";
        }
        return "Budget within limit.";
    }

}
