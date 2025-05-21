package com.devteria.identify_service.repository;

import com.devteria.identify_service.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUserId(String userId);

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items ci LEFT JOIN FETCH ci.product WHERE c.id = :cartId")
    Cart findByIdWithItemsAndProducts(Long cartId);

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items ci LEFT JOIN FETCH ci.product WHERE c.user.id = :userId")
    Cart findByUserIdWithItemsAndProducts(Long userId);
}