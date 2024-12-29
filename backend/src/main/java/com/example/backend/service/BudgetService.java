package com.example.backend.service;

import com.example.backend.dto.BudgetDTO;
import com.example.backend.models.BudgetEntity;
import com.example.backend.models.CategoryEntity;
import com.example.backend.models.ExpenseEntity;
import com.example.backend.models.UserEntity;
import com.example.backend.repo.BudgetRepository;
import com.example.backend.repo.CategoryRepository;
import com.example.backend.repo.ExpenseRepository;
import com.example.backend.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BudgetEntity> getAllBudgets(){
        return budgetRepository.findAll();
    }

    public List<BudgetEntity> getBudgetByUser(String email){
        return budgetRepository.findByEmail(email);
    }

    public Optional<BudgetEntity> getBudgetById(Long id){
        return budgetRepository.findById(id);
    }

    public Optional<BudgetEntity> getBudgetByCategoryForUser(String email, String category){
        return budgetRepository.findByUserEmailAndCategory(email,category);
    }

    public void createBudget(BudgetEntity budget){
        System.out.println(budget.getCategory());
        budgetRepository.save(budget);
    }

    public void updateBudget(Long id, BudgetDTO budgetDTO){
        Optional<BudgetEntity> existingBudgetOpt = budgetRepository.findById(id);

        if (existingBudgetOpt.isPresent()) {
            BudgetEntity existingBudget = existingBudgetOpt.get();

            // Update fields from DTO
            existingBudget.setAmount(budgetDTO.getAmount());
            existingBudget.setMonth(budgetDTO.getMonth());
            existingBudget.setYear(budgetDTO.getYear());

            // Update category (if applicable)
            Optional<CategoryEntity> category = categoryRepository.findById(budgetDTO.getCategoryId());
            category.ifPresent(existingBudget::setCategory);

            // Update user (if applicable)
            Optional<UserEntity> user = userRepository.findByEmail(budgetDTO.getUserId());
            user.ifPresent(existingBudget::setUser);

            budgetRepository.save(existingBudget); // Save the updated entity
        } else {
            throw new RuntimeException("Budget with ID " + id + " not found");
        }
    }

    public void deleteBudgetById(Long id){
        budgetRepository.deleteById(id);
    }


}
