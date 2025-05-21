package com.devteria.identify_service.repository;

import com.devteria.identify_service.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByName(String name);
    @Query("SELECT p FROM Product p WHERE p.category.collection.id = :collectionId")
    List<Product> findByCategoryCollectionId(Long collectionId);
    List<Product> findByCategoryId(Long categoryId);
}
