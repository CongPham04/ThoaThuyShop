package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.ProductReviewRequest;
import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.response.ProductReviewResponse;
import com.devteria.identify_service.service.ProductReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {
    @Autowired
    private ProductReviewService productReviewService;

    @PostMapping
    public ApiResponse<ProductReviewResponse> createReview(@RequestBody ProductReviewRequest request) {
        return ApiResponse.<ProductReviewResponse>builder()
                .data(productReviewService.createReview(request))
                .message("Review created successfully")
                .build();
    }

    @GetMapping("/product/{productId}")
    public ApiResponse<List<ProductReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ApiResponse.<List<ProductReviewResponse>>builder()
                .data(productReviewService.getProductReviews(productId))
                .message("Product reviews retrieved successfully")
                .build();
    }
}