package com.devteria.identify_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(nullable = false)
    String status; // pending, paid, shipped, delivered, cancelled

    @Column(nullable = false)
    BigDecimal totalPrice; // Added to store total price

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    List<OrderItem> items;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    ShippingInfo shippingInfo; // Added to establish the bidirectional relationship

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        status = "pending";
    }
}