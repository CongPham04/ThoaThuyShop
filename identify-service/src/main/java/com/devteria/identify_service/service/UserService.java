package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.UserCreationRequest;
import com.devteria.identify_service.dto.request.UserUpdateRequest;
import com.devteria.identify_service.dto.response.UserResponse;
import com.devteria.identify_service.entity.User;
import com.devteria.identify_service.enums.Role;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.UserMapper;
import com.devteria.identify_service.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;


@Service
@RequiredArgsConstructor // Tự động tạo final và @nonnull
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    UserRepository userRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    public User createRequest(UserCreationRequest request) {

        if (userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTED);
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.USER.name());
        user.setRoles(roles);
        return userRepository.save(user);
//        if (userRepository.existsByUsername(request.getUsername())) {
//            throw new AppException(ErrorCode.USER_EXISTED);
//        }
//        // Chỉ kiểm tra email nếu được cung cấp
//        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
//            if (userRepository.existsByEmail(request.getEmail())) {
//                throw new AppException(ErrorCode.EMAIL_EXISTED);
//            }
//        }
//
//        User user = userMapper.toUser(request);
//        user.setPassword(passwordEncoder.encode(request.getPassword()));
//
//        HashSet<String> roles = new HashSet<>();
//        roles.add(Role.USER.name());
//        user.setRoles(roles);
//
//        return userRepository.save(user);
    }
    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext(); // Thông tin user khi login thì được lưu vào SecurityContextHolder rồi giờ chỉ cần gọi lấy thông tin ra
        String username = context.getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }
    @PreAuthorize("hasRole('ADMIN')") // kiểm tra Role trước khi chạy Method - hay sử dụng
    public List<User> getUsers(){
        log.info("In method get users");
        List<User> users = userRepository.findAll();
//        List<UserResponse> userResponses = users.stream()
//                .map(userMapper::toUserResponse)
//                .toList();
        return users;
    }
//    @PostAuthorize("hasRole('ADMIN')") // Chạy Method trước khi kiểm tra Role - ít sử dụng hơn
    @PostAuthorize("returnObject.username == authentication.name") // Kiểm tra xem user trả về có đúng với user login va không?(Chỉ có user login thì mới có thể thấy được thông tin của user qua id thôi!)
    public UserResponse getUser(String id){
        log.info("In method get users by Id");
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")));
    }
    public UserResponse updateUser(String id, UserUpdateRequest request){
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
//        // Kiểm tra nếu request có chứa password và không rỗng
//        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
//            // Mã hóa mật khẩu mới và cập nhật
//
//        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userMapper.updateUser(user, request);
        // Lưu user đã cập nhật vào cơ sở dữ liệu
        User updatedUser = userRepository.save(user);
        // Ánh xạ user thành UserResponse và trả về
        return userMapper.toUserResponse(updatedUser);

    }
    public void deleteUser(String id){
        userRepository.deleteById(id);
    }
}
