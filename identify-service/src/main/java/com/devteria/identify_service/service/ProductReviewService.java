package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.ProductReviewRequest;
import com.devteria.identify_service.dto.response.ProductReviewResponse;
import com.devteria.identify_service.entity.Product;
import com.devteria.identify_service.entity.ProductReview;
import com.devteria.identify_service.entity.User;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.ProductReviewMapper;
import com.devteria.identify_service.repository.ProductRepository;
import com.devteria.identify_service.repository.ProductReviewRepository;
import com.devteria.identify_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductReviewService {
    @Autowired
    private ProductReviewRepository productReviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductReviewMapper productReviewMapper;

    public ProductReviewResponse createReview(ProductReviewRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        ProductReview review = ProductReview.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = productReviewRepository.save(review);
        return productReviewMapper.toProductReviewResponse(review);
    }

    public List<ProductReviewResponse> getProductReviews(Long productId) {
        List<ProductReview> reviews = productReviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(productReviewMapper::toProductReviewResponse)
                .collect(Collectors.toList());
    }
}