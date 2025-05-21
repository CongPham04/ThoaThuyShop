package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.ApiResponse;
import com.devteria.identify_service.dto.request.AuthenticationRequest;
import com.devteria.identify_service.dto.request.IntrospectRequest;
import com.devteria.identify_service.dto.request.UserCreationRequest;
import com.devteria.identify_service.dto.response.AuthenticationResponse;
import com.devteria.identify_service.dto.response.IntrospectResponse;
import com.devteria.identify_service.dto.response.UserResponse;
import com.devteria.identify_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "https://e392-113-185-53-88.ngrok-free.app", allowCredentials = "true")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // Cho phép các yêu cầu từ frontend
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AuthenticationController {
    AuthenticationService authenticationService;
    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {
        var result = authenticationService.authenticate(authenticationRequest);
        return ApiResponse.<AuthenticationResponse>builder()
                .data(result)
                .build();
    }
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        var result = authenticationService.introspect(introspectRequest);
        return ApiResponse.<IntrospectResponse>builder()
                .data(result)
                .build();
    }
    @PostMapping("/register")
    ApiResponse<UserResponse> register(@RequestBody UserCreationRequest request) {
        var result = authenticationService.createUser(request);
        return ApiResponse.<UserResponse>builder()
                .data(result)
                .build();
    }

}
