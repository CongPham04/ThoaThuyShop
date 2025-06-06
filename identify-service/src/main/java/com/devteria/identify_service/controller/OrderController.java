package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.CreateOrderRequest;
import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.response.CollectionResponse;
import com.devteria.identify_service.dto.response.OrderResponse;
import com.devteria.identify_service.dto.response.OrderResponseAdmin;
import com.devteria.identify_service.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .message("Tạo Oder thành công!")
                .data(orderService.createOrder(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<OrderResponse>> getUserOrders() {
        return ApiResponse.<List<OrderResponse>>builder()
                .message("Lấy Oder thành công!")
                .data(orderService.getUserOrders())
                .build();
    }
    @GetMapping("/admin")
    public ApiResponse<List<OrderResponseAdmin>> getAllOrdersForAdmin() {
        return ApiResponse.<List<OrderResponseAdmin>>builder()
                .message("Lấy tất cả đơn hàng thành công!")
                .data(orderService.getAllOrdersForAdmin())
                .build();
    }

    @DeleteMapping("/{orderId}")
    public ApiResponse<String> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ApiResponse.<String>builder()
                .message("Đơn hàng đã được hủy thành công!")
                .data("Order cancelled")
                .build();
    }

    @DeleteMapping("/{orderId}/cancel-by-admin")
    public ApiResponse<String> cancelOrderByAdmin(@PathVariable Long orderId) {
        orderService.cancelOrderByAdmin(orderId);
        return ApiResponse.<String>builder()
                .message("Đơn hàng đã được hủy bởi Admin thành công!")
                .data("Order cancelled by Admin")
                .build();
    }

    @PutMapping("/{orderId}/confirm")
    public ApiResponse<OrderResponseAdmin> confirmOrder(@PathVariable Long orderId) {
        return ApiResponse.<OrderResponseAdmin>builder()
                .message("Xác nhận đơn hàng thành công!")
                .data(orderService.confirmOrder(orderId))
                .build();
    }
}