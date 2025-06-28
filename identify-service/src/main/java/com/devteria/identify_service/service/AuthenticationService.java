package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.AuthenticationRequest;
import com.devteria.identify_service.dto.request.IntrospectRequest;
import com.devteria.identify_service.dto.request.UserCreationRequest;
import com.devteria.identify_service.dto.response.AuthenticationResponse;
import com.devteria.identify_service.dto.response.IntrospectResponse;
import com.devteria.identify_service.dto.response.UserResponse;
import com.devteria.identify_service.entity.User;
import com.devteria.identify_service.enums.Role;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.UserMapper;
import com.devteria.identify_service.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Set;
import java.util.StringJoiner;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);
    UserRepository userRepository;
    UserMapper userMapper;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    PasswordEncoder passwordEncoder;
public AuthenticationResponse<UserResponse> authenticate(AuthenticationRequest authenticationRequest) {
    // Tìm user bằng username
    var user = userRepository.findByUsername(authenticationRequest.getUsername())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

    // Kiểm tra mật khẩu
    boolean authenticated = passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword());
    if (!authenticated) {
        throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
    }

    // Tạo token JWT
    var token = generateToken(user);

    // Ánh xạ User sang UserResponse
    UserResponse userResponse = userMapper.toUserResponse(user);

    // Trả về AuthenticationResponse với thông tin người dùng
    return AuthenticationResponse.<UserResponse>builder()
            .token(token)
            .authenticated(true)
            .user(userResponse)
            .build();
}
    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("thoathuyshop.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()
                ))
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("cannot create TOKEN", e);
            throw new RuntimeException(e);
        }
    }
    public IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException {
        var token = introspectRequest.getToken();
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        return IntrospectResponse.builder()
                .valid( verified && expityTime.after(new Date()))
                .build();

    }
    public UserResponse createUser(UserCreationRequest request) {
        // Kiểm tra username đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        // Tạo user mới
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .dob(request.getDob())
                .gender(request.getGender())
                .roles(Set.of(Role.USER.name()))
                .build();

        // Lưu user vào database
        user = userRepository.save(user);

        // Trả về response
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .dob(user.getDob())
                .gender(user.getGender())
                .build();
    }
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(user.getRoles() != null && !user.getRoles().isEmpty())
            user.getRoles().forEach(stringJoiner::add);
        return stringJoiner.toString();
    }
}
