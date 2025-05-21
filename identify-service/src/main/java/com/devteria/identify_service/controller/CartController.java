package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.AddToCartRequest;
import com.devteria.identify_service.dto.request.UpdateCartItemRequest;
import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.response.CartResponse;
import com.devteria.identify_service.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    public ApiResponse<CartResponse> getCart() {
        return ApiResponse.<CartResponse>builder()
                .data(cartService.getCart())
                .build();
    }
    @GetMapping("/{cartId}")
    public ApiResponse<CartResponse> getCartById(@PathVariable Long cartId) {
        return ApiResponse.<CartResponse>builder()
                .data(cartService.getCartById(cartId))
                .message("Cart retrieved successfully")
                .build();
    }
    @PostMapping("/add")
    public ApiResponse<CartResponse> addToCart(@RequestBody AddToCartRequest request) {
        System.out.println("request: " + request);
        return ApiResponse.<CartResponse>builder()
                .data(cartService.addToCart(request))
                .message("Item added to cart successfully")
                .build();
    }

    @PutMapping("/update")
    public ApiResponse<CartResponse> updateCartItem(@RequestBody UpdateCartItemRequest request) {
        return ApiResponse.<CartResponse>builder()
                .data(cartService.updateCartItem(request))
                .message("Item updated to cart successfully")
                .build();
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ApiResponse<CartResponse> removeCartItem(@PathVariable Long cartItemId) {
        return ApiResponse.<CartResponse>builder()
                .data(cartService.removeCartItem(cartItemId))
                .message("Item removed to cart successfully")
                .build();
    }
}