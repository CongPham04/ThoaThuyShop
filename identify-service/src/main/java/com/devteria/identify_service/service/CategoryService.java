package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.CategoryRequest;
import com.devteria.identify_service.dto.response.CategoryResponse;
import com.devteria.identify_service.entity.Category;
import com.devteria.identify_service.entity.Collection;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.CategoryMapper;
import com.devteria.identify_service.repository.CategoryRepository;
import com.devteria.identify_service.repository.CollectionRepository;
import lombok.AccessLevel;
import lombok.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryService {
    CategoryRepository categoryRepository;
    CollectionRepository collectionRepository;
    CategoryMapper categoryMapper;
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CategoryResponse createCategory(CategoryRequest request) {
        Collection collection = collectionRepository.findById(request.getCollectionId())
                .orElseThrow(() -> new AppException(ErrorCode.COLLECTION_NOT_FOUND));

        Category category = categoryMapper.toCategory(request);
        category.setCollection(collection);

        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
    }

    public List<CategoryResponse> getCategoriesByCollection(Long collectionId) {
        if (collectionId == null) {
            throw new IllegalArgumentException("Collection ID cannot be null");
        }

        return Optional.ofNullable(categoryRepository.findByCollectionId(collectionId))
                .orElseGet(Collections::emptyList)
                .stream()
                .map(categoryMapper::toCategoryResponse)
                .collect(Collectors.toList());
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Collection collection = collectionRepository.findById(request.getCollectionId())
                .orElseThrow(() -> new AppException(ErrorCode.COLLECTION_NOT_FOUND));

        category.setName(request.getName());
        category.setCollection(collection);

        category = categoryRepository.save(category);
        return categoryMapper.toCategoryResponse(category);
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }
}
