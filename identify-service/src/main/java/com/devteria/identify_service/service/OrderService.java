package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.CreateOrderRequest;
import com.devteria.identify_service.dto.request.OrderItemRequest;
import com.devteria.identify_service.dto.response.OrderItemResponse;
import com.devteria.identify_service.dto.response.OrderResponse;
import com.devteria.identify_service.dto.response.OrderResponseAdmin;
import com.devteria.identify_service.entity.*;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.OrderMapper;
import com.devteria.identify_service.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ShippingInfoRepository shippingInfoRepository;

    @Autowired
    private OrderMapper orderMapper;

    public OrderResponse createOrder(CreateOrderRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Validate shipping info
        if (request.getFullName() == null || request.getPhoneNumber() == null || request.getAddress() == null ||
                request.getFullName().trim().isEmpty() || request.getPhoneNumber().trim().isEmpty() || request.getAddress().trim().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        // Create Order
        Order order = Order.builder()
                .user(user)
                .items(new ArrayList<>())
                .build();

        // Calculate total price and create order items
        BigDecimal totalPrice = BigDecimal.ZERO;
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequest itemRequest : request.getItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
                if (itemRequest.getQuantity() <= 0) {
                    throw new AppException(ErrorCode.INVALID_QUANTITY);
                }
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(product)
                        .quantity(itemRequest.getQuantity())
                        .price(product.getPrice())
                        .build();
                totalPrice = totalPrice.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
                order.getItems().add(orderItem);
            }
        } else {
            throw new AppException(ErrorCode.ORDER_ITEMS_EMPTY);
        }

        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);

        // Create Shipping Info
        ShippingInfo shippingInfo = ShippingInfo.builder()
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .order(order)
                .build();
        shippingInfoRepository.save(shippingInfo);

        // Clear cart if items came from cart (optional, based on your logic)
        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart != null) {
            cart.getItems().clear();
            cart.calculateTotalPrice();
            cartRepository.save(cart);
        }

        return orderMapper.toOrderResponse(order);
    }

    public List<OrderResponse> getUserOrders() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        List<Order> orders = orderRepository.findByUserId(user.getId());
        return orders.stream()
                .map(orderMapper::toOrderResponse)
                .collect(Collectors.toList());
    }
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderResponseAdmin> getAllOrdersForAdmin() {
        List<Order> allOrders = orderRepository.findAll();
        return allOrders.stream()
                .map(orderMapper::toOrderResponseAdmin)
                .collect(Collectors.toList());
    }

    public void cancelOrder(Long orderId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Ensure the order belongs to the authenticated user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        // Delete associated shipping info and order items
        shippingInfoRepository.delete(order.getShippingInfo());
        orderItemRepository.deleteAll(order.getItems());

        // Delete the order
        orderRepository.delete(order);
    }
    @PreAuthorize("hasRole('ADMIN')")
    public void cancelOrderByAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Delete associated shipping info and order items
        shippingInfoRepository.delete(order.getShippingInfo());
        orderItemRepository.deleteAll(order.getItems());

        // Delete the order
        orderRepository.delete(order);
    }
    @PreAuthorize("hasRole('ADMIN')")
    public OrderResponseAdmin confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Chỉ cho phép xác nhận nếu trạng thái là "pending"
        if (!order.getStatus().equals("pending")) {
            throw new AppException(ErrorCode.ORDER_CANNOT_BE_CONFIRME);
        }

        // Cập nhật trạng thái thành "confirmed"
        order.setStatus("confirmed");
        order = orderRepository.save(order);

        return orderMapper.toOrderResponseAdmin(order);
    }
}