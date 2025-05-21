package com.devteria.identify_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewResponse {
    Long id;
    String userId;
    String username;
    Long productId;
    Integer rating;
    String comment;
    LocalDateTime createdAt;
}