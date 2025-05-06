package com.devteria.identify_service.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String username;
    String password;
    String firstname;
    String lastname;
    LocalDate dob;
    @ElementCollection
    Set<String> roles;

//    // Các trường bổ sung cho security
//    boolean enabled = true;
//    boolean accountNonExpired = true;
//    boolean accountNonLocked = true;
//    boolean credentialsNonExpired = true;
}
//import com.devteria.identify_service.enums.AccountStatus;
//import com.devteria.identify_service.enums.Roles;
//import jakarta.persistence.*;
//import lombok.*;
//import lombok.experimental.FieldDefaults;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Set;
//
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//@FieldDefaults(level = AccessLevel.PRIVATE)
//@Entity
//@Table(name = "users") // Đặt tên bảng để rõ ràng
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID) // Sử dụng UUID làm ID
//    String id;
//
//    @Column(nullable = false)
//    String fullName;
//
//    @Column(nullable = false, unique = true)
//    String email;
//
//    @Column
//    String phoneNumber;
//
//    @Column(nullable = false)
//    String password;
//
//    @ElementCollection(fetch = FetchType.EAGER)
//    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
//    @Enumerated(EnumType.STRING)
//    @Builder.Default
//    Set<Roles> roles = Set.of(Roles.USER);
//
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    @Builder.Default
//    AccountStatus status = AccountStatus.UNVERIFIED;
//
//    @Embedded
//    Token refreshToken;
//
//    @Embedded
//    Token otp;
//
//    @Column
//    String urlAvatar;
//
//    @Embedded
//    Token forgotPasswordToken;
//
//    @Builder.Default
//    @Column(nullable = false)
//    Boolean isDelete = false;
//
//    @ElementCollection
//    @CollectionTable(name = "user_addresses", joinColumns = @JoinColumn(name = "user_id"))
//    List<Address> addresses;
//
//    @Column(nullable = false, updatable = false)
//    LocalDateTime createdAt;
//
//    @Column(nullable = false)
//    LocalDateTime updatedAt;
//
//    @PrePersist
//    public void prePersist() {
//        this.createdAt = LocalDateTime.now();
//        this.updatedAt = LocalDateTime.now();
//    }
//
//    @PreUpdate
//    public void preUpdate() {
//        this.updatedAt = LocalDateTime.now();
//    }
//}
