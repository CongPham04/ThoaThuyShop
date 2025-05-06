package com.devteria.identify_service.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthenticationRequest {
    String username; // Thay đổi từ username sang usernameOrEmail
    String password;
  //  boolean rememberMe; // Thêm trường remember me
}
