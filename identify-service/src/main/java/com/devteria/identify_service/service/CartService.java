package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.AddToCartRequest;
import com.devteria.identify_service.dto.request.UpdateCartItemRequest;
import com.devteria.identify_service.dto.response.CartResponse;
import com.devteria.identify_service.entity.Cart;
import com.devteria.identify_service.entity.CartItem;
import com.devteria.identify_service.entity.Product;
import com.devteria.identify_service.entity.User;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.CartMapper;
import com.devteria.identify_service.repository.CartItemRepository;
import com.devteria.identify_service.repository.CartRepository;
import com.devteria.identify_service.repository.ProductRepository;
import com.devteria.identify_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartMapper cartMapper;

    public CartResponse getCart() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            cart = Cart.builder().user(user).build();
            cart = cartRepository.save(cart);
        }

        return cartMapper.toCartResponse(cart);
    }
    public CartResponse getCartById(Long cartId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));

        // Ensure the cart belongs to the authenticated user
        if (!cart.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
        }

        return cartMapper.toCartResponse(cart);
    }
    public CartResponse addToCart(AddToCartRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            cart = Cart.builder().user(user).build();
            cart = cartRepository.save(cart);
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        CartItem existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }

        cart.calculateTotalPrice();
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse updateCartItem(UpdateCartItemRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        CartItem cartItem = cartItemRepository.findById(request.getCartItemId())
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        cart.calculateTotalPrice();
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    public CartResponse removeCartItem(Long cartItemId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Cart cart = cartRepository.findByUserId(user.getId());
        if (cart == null) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        cart.calculateTotalPrice();
        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }
}