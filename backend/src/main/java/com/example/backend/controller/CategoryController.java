package com.example.backend.controller;

import com.example.backend.models.CategoryEntity;
import com.example.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/getCategories")
    public List<CategoryEntity> getCategories(){
        return categoryService.getCategories();
    }

    @GetMapping("/getCategoryById/{id}")
    public Optional<CategoryEntity> getCategoryById(@PathVariable Long id){
        return categoryService.getCategoryById(id);
    }

    @PostMapping("/createCategory")
    public void createCategory(@RequestBody CategoryEntity category){
        categoryService.createCategory(category);
    }

    @DeleteMapping("/deleteCategory/{id}")
    public void deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
    }
}
