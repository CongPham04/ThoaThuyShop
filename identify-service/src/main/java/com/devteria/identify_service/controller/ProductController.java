package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.ProductRequest;
import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.response.ProductResponse;
import com.devteria.identify_service.entity.Product;
import com.devteria.identify_service.service.ProductService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {
    ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> createProduct(@Valid @ModelAttribute ProductRequest request) throws IOException {
        return ApiResponse.<ProductResponse>builder()
                .data(productService.createProduct(request))
                .build();
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<ProductResponse> getProduct(@PathVariable Long productId) {
        return ApiResponse.<ProductResponse>builder()
                .data(productService.getProduct(productId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ProductResponse>> getAllProducts() {
        return ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getAllProducts())
                .build();
    }
    @GetMapping("/allProducts/{categoryId}")
    public ApiResponse<List<ProductResponse>> getProductsByCategory(@PathVariable(required = false) Long categoryId) {
        return ApiResponse.<List<ProductResponse>>builder()
                .data(productService.getProductsByCategory(categoryId))
                .build();
    }

    @PutMapping(value = "/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProductResponse> updateProduct(@PathVariable Long productId, @Valid @ModelAttribute ProductRequest request) throws IOException {
        return ApiResponse.<ProductResponse>builder()
                .data(productService.updateProduct(productId, request))
                .build();
    }

    @DeleteMapping("/{productId}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ApiResponse.<Void>builder()
                .message("Product deleted successfully")
                .build();
    }

    @GetMapping("/{productId}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable("productId") Long productId) {
        System.out.println("id: " + productId);
        ProductResponse product = productService.getProduct(productId);
        byte[] imageData = productService.getProductImage(productId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(product.getImageType()))
                .body(imageData);
    }
    @GetMapping("/random/{collectionId}")
    public ApiResponse<ProductResponse> getRandomProductByCollection(@PathVariable Long collectionId) {
        ProductResponse product = productService.getRandomProductByCollection(collectionId);
        return ApiResponse.<ProductResponse>builder()
                .data(product)
                .message("Successfully fetched a random product for collection ID: " + collectionId)
                .build();
    }

}
