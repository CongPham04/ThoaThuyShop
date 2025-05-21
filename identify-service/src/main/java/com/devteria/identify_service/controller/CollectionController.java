package com.devteria.identify_service.controller;
import com.devteria.identify_service.dto.request.CollectionRequest;
import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.response.CollectionResponse;
import com.devteria.identify_service.service.CollectionService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/collections")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CollectionController {
    CollectionService collectionService;

    @PostMapping("/addCollection")
    ApiResponse<CollectionResponse> createCollection(@RequestBody @Valid CollectionRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Current auth: " + auth);
        System.out.println("Authorities: " + auth.getAuthorities());
        return ApiResponse.<CollectionResponse>builder()
                .message("Tạo Collection thành công!")
                .data(collectionService.createCollection(request))
                .build();
    }

    @GetMapping("/allCollections")
    ApiResponse<List<CollectionResponse>> getAllCollections() {
        return ApiResponse.<List<CollectionResponse>>builder()
                .message("Lấy tất cả Collection thành công!")
                .data(collectionService.getAllCollections())
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CollectionResponse> getCollection(@PathVariable Long id) {
        return ApiResponse.<CollectionResponse>builder()
                .message("Lấy 1 Collection thành công!")
                .data(collectionService.getCollection(id))
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CollectionResponse> updateCollection(@PathVariable Long id, @RequestBody @Valid CollectionRequest request) {
        return ApiResponse.<CollectionResponse>builder()
                .message("cập nhật Collection thành công")
                .data(collectionService.updateCollection(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ApiResponse.<String>builder()
                .message(" xoá Collection thành công!")
                .build();
    }
}
