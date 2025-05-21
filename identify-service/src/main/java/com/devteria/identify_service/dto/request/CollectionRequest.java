package com.devteria.identify_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CollectionRequest {
    @NotBlank(message = "COLLECTION_NAME_REQUIRED")
    String name;
}
