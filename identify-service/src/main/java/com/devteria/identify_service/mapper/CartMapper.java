package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.response.CartItemResponse;
import com.devteria.identify_service.dto.response.CartResponse;
import com.devteria.identify_service.entity.Cart;
import com.devteria.identify_service.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {
    @Mapping(target = "imageUrl", expression = "java(cartItem.getProduct() != null ? \"/api/products/\" + cartItem.getProduct().getId() + \"/image\" : null)")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "price", source = "product.price")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    @Mapping(target = "items", source = "items")
    @Mapping(target = "totalPrice", source = "totalPrice", qualifiedByName = "handleNullTotalPrice")
    CartResponse toCartResponse(Cart cart);

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);

    @Named("handleNullTotalPrice")
    default BigDecimal handleNullTotalPrice(BigDecimal totalPrice) {
        return totalPrice != null ? totalPrice : BigDecimal.ZERO;
    }
}