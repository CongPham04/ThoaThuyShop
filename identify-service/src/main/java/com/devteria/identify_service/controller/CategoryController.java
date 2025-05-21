package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.CategoryRequest;
import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.response.CategoryResponse;
import com.devteria.identify_service.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryController {
    CategoryService categoryService;

    @PostMapping("/addCategory")
    ApiResponse<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest request) {
        System.out.println(request.getCollectionId());
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.createCategory(request))
                .build();
    }

    @GetMapping("/allCategory")
    ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.<List<CategoryResponse>>builder()
                .data(categoryService.getAllCategories())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CategoryResponse> getCategory(@PathVariable Long id) {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.getCategory(id))
                .build();
    }

    @GetMapping("/collection/{collectionId}")
    ApiResponse<List<CategoryResponse>> getCategoriesByCollection(@PathVariable Long collectionId) {
        return ApiResponse.<List<CategoryResponse>>builder()
                .data(categoryService.getCategoriesByCollection(collectionId))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CategoryResponse> updateCategory(@PathVariable Long id, @RequestBody @Valid CategoryRequest request) {
        return ApiResponse.<CategoryResponse>builder()
                .data(categoryService.updateCategory(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.<String>builder()
                .message("Category deleted successfully")
                .build();
    }
}
