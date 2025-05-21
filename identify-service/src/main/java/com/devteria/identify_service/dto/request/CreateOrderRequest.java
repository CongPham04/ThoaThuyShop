package com.devteria.identify_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    String fullName;
    String phoneNumber;
    String address;
    List<OrderItemRequest> items; // Reference the new top-level class
}