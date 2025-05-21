package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.response.OrderItemResponse;
import com.devteria.identify_service.dto.response.OrderResponse;
import com.devteria.identify_service.dto.response.ShippingInfoResponse;
import com.devteria.identify_service.entity.Order;
import com.devteria.identify_service.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "shippingInfo", expression = "java(toShippingInfoResponse(order))")
    OrderResponse toOrderResponse(Order order);
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
}