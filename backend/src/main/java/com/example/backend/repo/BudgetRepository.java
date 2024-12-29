package com.example.backend.repo;

import com.example.backend.models.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<BudgetEntity,Long> {

    @Query("SELECT b FROM BudgetEntity b WHERE b.user.email = :email")
     List<BudgetEntity> findByEmail(@Param("email") String email);

    @Query("SELECT b FROM BudgetEntity b WHERE b.user.email = :email AND b.category.category = :category")
    Optional<BudgetEntity> findByUserEmailAndCategory(@Param("email") String email, @Param("category") String category);

    @Query("SELECT b FROM BudgetEntity b WHERE b.user.email = :email AND b.category.id = :category AND b.month = :month AND b.year = :year")
    Optional<BudgetEntity> findByDate(@Param("email") String email, @Param("category") Long category, @Param("month") String month, @Param("year") int year);

    @Query("SELECT SUM(b.amount) FROM BudgetEntity b WHERE b.user.email = :email AND b.month = :month AND b.year = :year")
    Optional<Double> findTotalBudgetForUser(@Param("email") String email, @Param("month") String month, @Param("year") int year);

}
