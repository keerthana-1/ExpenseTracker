package com.example.backend.repo;

import com.example.backend.models.ExpenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity,Long> {

    @Query("SELECT e FROM ExpenseEntity e WHERE e.user.email = :email")
    List<ExpenseEntity> findByEmail(@Param("email") String email);

    @Query("SELECT e FROM ExpenseEntity e WHERE e.user.email = :email AND e.category.category = :category")
    Optional<ExpenseEntity> findByUserEmailAndCategory(@Param("email") String email, @Param("category") String category);

    List<ExpenseEntity> findByIsRecurringTrue();

    @Query("SELECT SUM(e.amount) FROM ExpenseEntity e WHERE e.user.email = :email AND FUNCTION('MONTH', e.date) = :month AND FUNCTION('YEAR', e.date) = :year")
    Optional<Double> findTotalExpensesForUser(@Param("email") String email, @Param("month") String month, @Param("year") int year);

    @Query("SELECT e FROM ExpenseEntity e WHERE e.user.email = :email AND e.isRecurring = true")
    List<ExpenseEntity> findRecurringExpensesByUser(@Param("email") String email);


}
