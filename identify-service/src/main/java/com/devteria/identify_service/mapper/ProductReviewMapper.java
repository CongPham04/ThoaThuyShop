package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.response.ProductReviewResponse;
import com.devteria.identify_service.entity.ProductReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductReviewMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "product.id", target = "productId")
    ProductReviewResponse toProductReviewResponse(ProductReview review);
}