package com.devteria.identify_service.dto.request;

import jakarta.persistence.ElementCollection;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    @Size(min = 3, message = "USER_INVALID")
    String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String password;

//    @Email(message = "INVALID_EMAIL")
//    String email; // Thêm email

    String firstname;
    String lastname;
    LocalDate dob;
    Set<String> roles;
}
