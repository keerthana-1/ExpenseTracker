package com.example.backend.service;


import com.example.backend.dto.BudgetDTO;
import com.example.backend.dto.ExpenseDTO;
import com.example.backend.models.BudgetEntity;
import com.example.backend.models.CategoryEntity;
import com.example.backend.models.ExpenseEntity;
import com.example.backend.models.UserEntity;
import com.example.backend.repo.BudgetRepository;
import com.example.backend.repo.CategoryRepository;
import com.example.backend.repo.ExpenseRepository;
import com.example.backend.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ExpenseEntity> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<ExpenseEntity> getExpensesofUser(String email) {
        return expenseRepository.findByEmail(email);
    }

    public Optional<ExpenseEntity> getExpensesofUserForCategory(String email, String category) {

        return expenseRepository.findByUserEmailAndCategory(email, category);
    }


    public void createExpense(ExpenseDTO expense) {

        updateBudget(expense);

        CategoryEntity category = categoryRepository.findById(expense.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found for id: " + expense.getCategoryId()));

        // Fetch the UserEntity based on the userId
        UserEntity user = userRepository.findByEmail(expense.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for email: " + expense.getUserId()));

        ExpenseEntity expenseEntity = new ExpenseEntity();
        expenseEntity.setCategory(category);
        expenseEntity.setUser(user);
        expenseEntity.setDate(expense.getDate());
        expenseEntity.setName(expense.getName());
        expenseEntity.setRecurring(expense.getIsRecurring());
        expenseEntity.setAmount(expense.getAmount());

        expenseRepository.save(expenseEntity);
    }

    public void updateBudget(ExpenseDTO expense) {
        Date date = expense.getDate();

        // Convert Date to LocalDateTime
        LocalDateTime dateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        // Extract year and month
        int year = dateTime.getYear();
        String monthName = dateTime.getMonth().name(); // Uppercase month name

        // Format month name to proper capitalization
        String formattedMonthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();
        System.out.println(formattedMonthName + " " + year);
        BudgetEntity budgetEntity = budgetRepository.findByDate(expense.getUserId(), expense.getCategoryId(), formattedMonthName, year).orElse(null);

        if (budgetEntity != null) {
            Long budgetId = budgetEntity.getId();

            double budget = budgetEntity.getAmount();
            budget -= expense.getAmount();

            BudgetDTO budgetDTO = new BudgetDTO();
            budgetDTO.setAmount(budget);
            budgetDTO.setCategoryId(budgetEntity.getCategory().getId());
            budgetDTO.setMonth(formattedMonthName);
            budgetDTO.setYear(year);
            budgetDTO.setUserId(budgetEntity.getUser().getEmail());

            budgetService.updateBudget(budgetId, budgetDTO);
        } else {
            System.out.println("No budget found for user in the specified month and year.");
        }
    }

    public void updateExpense(ExpenseDTO expense, Long id) {
        Optional<ExpenseEntity> existingExpenseOpt = expenseRepository.findById(id);

        if (existingExpenseOpt.isPresent()) {
            ExpenseEntity existingExpense = existingExpenseOpt.get();

            // Update fields from DTO
            existingExpense.setAmount(expense.getAmount());
            existingExpense.setName(expense.getName());
            existingExpense.setDate(expense.getDate());
            existingExpense.setRecurring(expense.getIsRecurring());
            // Update category (if applicable)
            Optional<CategoryEntity> category = categoryRepository.findById(expense.getCategoryId());
            category.ifPresent(existingExpense::setCategory);

            // Update user (if applicable)
            Optional<UserEntity> user = userRepository.findByEmail(expense.getUserId());
            user.ifPresent(existingExpense::setUser);

            expenseRepository.save(existingExpense); // Save the updated entity
        } else {
            throw new RuntimeException("Expense with ID " + id + " not found");
        }
    }

    public void deleteExpenseById(Long id) {

        Optional<ExpenseEntity> expenseOpt = expenseRepository.findById(id);

        if (expenseOpt.isPresent()) {
            ExpenseEntity expense = expenseOpt.get();

            LocalDateTime dateTime = expense.getDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

            int year = dateTime.getYear();
            String monthName = dateTime.getMonth().name();

            String formattedMonthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();


            BudgetEntity budgetEntity = budgetRepository.findByDate(
                    expense.getUser().getEmail(),
                    expense.getCategory().getId(),
                    formattedMonthName,
                    year
            ).orElse(null);

            if (budgetEntity != null) {
                budgetEntity.setAmount(budgetEntity.getAmount() + expense.getAmount());
                budgetRepository.save(budgetEntity); // Save the updated budget
            } else {
                System.out.println("No budget found to update for the deleted expense.");
            }

            expenseRepository.deleteById(id);
        } else {
            throw new RuntimeException("Expense with ID " + id + " not found");
        }
    }


    public Double getBudgetForExpense(ExpenseDTO expense) {

        Date date = expense.getDate();

        // Convert Date to LocalDateTime
        LocalDateTime dateTime = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        // Extract year and month
        int year = dateTime.getYear();
        String monthName = dateTime.getMonth().name(); // Uppercase month name

        // Format month name to proper capitalization
        String formattedMonthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();
        System.out.println(formattedMonthName + " " + year);

        BudgetEntity budgetEntity = budgetRepository.findByDate(expense.getUserId(), expense.getCategoryId(), formattedMonthName, year).orElse(null);
        if (budgetEntity != null) {
            return budgetEntity.getAmount();
        }
        return -1.0;
    }

    public Optional<ExpenseEntity> getExpenseById(Long id) {
        return expenseRepository.findById(id);
    }

    @Scheduled(cron = "0 0 0 1 * *") // Runs at midnight on the 1st of every month
    public void addRecurringExpenses() {
        List<ExpenseEntity> recurringExpenses = expenseRepository.findByIsRecurringTrue();

        for (ExpenseEntity expense : recurringExpenses) {
            ExpenseEntity newExpense = new ExpenseEntity();
            newExpense.setCategory(expense.getCategory());
            newExpense.setUser(expense.getUser());
            newExpense.setName(expense.getName());
            newExpense.setAmount(expense.getAmount());
            newExpense.setRecurring(true);

            // Set the new date for the next month
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(expense.getDate());
            calendar.add(Calendar.MONTH, 1);
            newExpense.setDate(calendar.getTime());

            expenseRepository.save(newExpense);
        }
    }
}
