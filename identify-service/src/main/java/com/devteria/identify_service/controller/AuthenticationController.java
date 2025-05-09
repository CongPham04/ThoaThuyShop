package com.devteria.identify_service.controller;

import com.devteria.identify_service.dto.request.ApiRespose;
import com.devteria.identify_service.dto.request.AuthenticationRequest;
import com.devteria.identify_service.dto.request.IntrospectRequest;
import com.devteria.identify_service.dto.request.UserCreationRequest;
import com.devteria.identify_service.dto.response.AuthenticationResponse;
import com.devteria.identify_service.dto.response.IntrospectResponse;
import com.devteria.identify_service.dto.response.UserResponse;
import com.devteria.identify_service.repository.UserRepository;
import com.devteria.identify_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "https://82d2-2001-ee0-232-b6df-15c-2c19-2d0c-badb.ngrok-free.app", allowCredentials = "true")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // Cho phép các yêu cầu từ frontend
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class AuthenticationController {
    AuthenticationService authenticationService;
    @PostMapping("/token")
    ApiRespose<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest authenticationRequest) {
        var result = authenticationService.authenticate(authenticationRequest);
        return ApiRespose.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/introspect")
    ApiRespose<IntrospectResponse> authenticate(@RequestBody IntrospectRequest introspectRequest) throws ParseException, JOSEException {
        var result = authenticationService.introspect(introspectRequest);
        return ApiRespose.<IntrospectResponse>builder()
                .result(result)
                .build();
    }
//    @PostMapping("/register")
//    ApiRespose<UserResponse> register(@RequestBody UserCreationRequest request) {
//        var result = authenticationService.createUser(request);
//        return ApiRespose.<UserCreationResponse>builder()
//                .result(result)
//                .build();
//    }

}
