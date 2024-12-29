package com.example.backend.controller;

import com.example.backend.dto.BudgetDTO;
import com.example.backend.dto.ExpenseDTO;
import com.example.backend.models.BudgetEntity;
import com.example.backend.models.ExpenseEntity;
import com.example.backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/getExpenses")
    public List<ExpenseEntity> getAllExpenses(){
        return expenseService.getAllExpenses();
    }

    @GetMapping("/getUserExpenses/{email}")
    public List<ExpenseEntity> getUserExpenses(@PathVariable String email){
        return expenseService.getExpensesofUser(email);
    }


    @GetMapping("/getUserExpensesForCategory/{email}/{category}")
    public Optional<ExpenseEntity> getUserExpensesForCategory(@PathVariable String email,@PathVariable String category){
        return expenseService.getExpensesofUserForCategory(email,category);
    }

    @PostMapping("/addExpense")
    public void createExpense(@RequestBody ExpenseDTO expense){

        expenseService.createExpense(expense);
    }

    @PutMapping("/updateExpense/{id}")
    public void updateExpense(@RequestBody ExpenseDTO expense,@PathVariable Long id){

        expenseService.updateExpense(expense,id);
    }

    @DeleteMapping("/deleteExpense/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpenseById(id);
    }

    @PostMapping("/getBudgetForExpense")
    public Double getBudgetForExpense(@RequestBody ExpenseDTO expenseDTO){
        return expenseService.getBudgetForExpense(expenseDTO);
    }

    @GetMapping("/getExpenseByID/{id}")
    public Optional<ExpenseEntity> getExpenseById(@PathVariable Long id){
        System.out.println(id);
        return expenseService.getExpenseById(id);
    }
}
