package com.example.backend.service;

import com.example.backend.models.CategoryEntity;
import com.example.backend.repo.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryEntity> getCategories(){
        return categoryRepository.findAll();
    }

    public Optional<CategoryEntity> getCategoryById(Long id){
        return categoryRepository.findById(id);
    }

    public void createCategory(CategoryEntity category){
        categoryRepository.save(category);
    }

    public void deleteCategory(Long id){
        categoryRepository.deleteById(id);
    }
}
