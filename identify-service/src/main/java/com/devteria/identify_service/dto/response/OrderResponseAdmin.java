package com.devteria.identify_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponseAdmin {
    Long id;
    String status;
    LocalDateTime createdAt;
    BigDecimal totalPrice;
    List<OrderItemResponse> items;
    ShippingInfoResponse shippingInfo;
    String userId;
}