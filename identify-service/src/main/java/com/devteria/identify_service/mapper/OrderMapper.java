package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.response.*;
import com.devteria.identify_service.entity.Order;
import com.devteria.identify_service.entity.OrderItem;
import com.devteria.identify_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "shippingInfo", expression = "java(toShippingInfoResponse(order))")
    @Mapping(target = "userId", source = "order.user.id") // Ánh xạ userId
    OrderResponse toOrderResponse(Order order);

    @Mapping(target = "shippingInfo", expression = "java(toShippingInfoResponse(order))")
    @Mapping(target = "userId", source = "order.user.id") // Ánh xạ userId
    OrderResponseAdmin toOrderResponseAdmin(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    default ShippingInfoResponse toShippingInfoResponse(Order order) {
        if (order.getItems().isEmpty() || order.getItems().get(0).getOrder().getShippingInfo() == null) {
            return null;
        }
        return toShippingInfoResponse(order.getItems().get(0).getOrder().getShippingInfo());
    }

    ShippingInfoResponse toShippingInfoResponse(com.devteria.identify_service.entity.ShippingInfo shippingInfo);

    List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> orderItems);

    UserResponse toUserInfoResponse(User user); // Đổi tên từ toUserResponse sang toUserInfoResponse

}