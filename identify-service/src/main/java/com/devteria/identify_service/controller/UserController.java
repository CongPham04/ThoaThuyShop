package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.ApiRespose;
import com.devteria.identify_service.dto.request.UserCreationRequest;
import com.devteria.identify_service.dto.request.UserUpdateRequest;
import com.devteria.identify_service.dto.response.UserResponse;
import com.devteria.identify_service.entity.User;
import com.devteria.identify_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    UserService userService;
    @PostMapping
    ApiRespose<User> addUser(@RequestBody @Valid UserCreationRequest request) {
        ApiRespose<User> respose = new ApiRespose<>();
        respose.setResult(userService.createRequest(request));
        return respose;
    }
    @GetMapping("/allUsers")
    List<User> getAllUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("username: {}", authentication.getName());
        authentication.getAuthorities().forEach(grantedAuthority -> log.info(grantedAuthority.getAuthority()));
        return userService.getUsers();
    }
    @GetMapping("/{userId}")
    ApiRespose<UserResponse> getUser(@PathVariable("userId") String userId) {
        return ApiRespose.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }
    @GetMapping("/myInfo") // lấy thông tin user khi login
    ApiRespose<UserResponse> getMyInfo() {
        return ApiRespose.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }
    @PutMapping("/{userId}")
    UserResponse updateUser(@PathVariable("userId") String userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }
    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUser(userId);
        return "User has been deleted";
    }
}
