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
        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        // Ánh xạ request sang entity User
        User user = userMapper.toUser(request);
        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Xử lý vai trò: chỉ lấy vai trò đầu tiên từ Set<String> roles
        HashSet<String> roles = new HashSet<>();
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            String role = request.getRoles().iterator().next(); // Lấy vai trò đầu tiên
            if (Role.ADMIN.name().equalsIgnoreCase(role) || Role.USER.name().equalsIgnoreCase(role)) {
                roles.add(role.toUpperCase()); // Chuyển vai trò thành chữ hoa để đồng nhất
            } else {
                roles.add(Role.USER.name()); // Mặc định là USER nếu vai trò không hợp lệ
            }
        } else {
            roles.add(Role.USER.name()); // Mặc định là USER nếu không có vai trò
        }
        user.setRoles(roles);

        // Lưu user vào cơ sở dữ liệu
        return userRepository.save(user);
    }
    public UserResponse getMyInfo(){
        var context = SecurityContextHolder.getContext(); // Thông tin user khi login thì được lưu vào SecurityContextHolder rồi giờ chỉ cần gọi lấy thông tin ra
        String username = context.getAuthentication().getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }
    @PreAuthorize("hasRole('ADMIN')") // kiểm tra Role trước khi chạy Method - hay sử dụng
    public List<UserResponse> getUsers(){
        log.info("In method get users");
        List<User> users = userRepository.findAll();
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }
//    @PostAuthorize("hasRole('ADMIN')") // Chạy Method trước khi kiểm tra Role - ít sử dụng hơn
    @PostAuthorize("returnObject.username == authentication.name") // Kiểm tra xem user trả về có đúng với user login va không?(Chỉ có user login thì mới có thể thấy được thông tin của user qua id thôi!)
    public UserResponse getUser(String id){
        log.info("In method get users by Id");
        return userMapper.toUserResponse(userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")));
    }
    public UserResponse updateUser(String id, UserUpdateRequest request){
//        // Tìm user theo ID
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Lưu mật khẩu cũ để so sánh
//        String originalPassword = user.getPassword();
//
//        // Cập nhật các trường khác (trừ password) bằng userMapper
//        userMapper.updateUser(user, request);
//
//        // Kiểm tra và mã hóa password nếu có giá trị mới
//        if (request.getPassword() != null && !request.getPassword().isEmpty() &&
//                !request.getPassword().equals(originalPassword)) {
//            user.setPassword(passwordEncoder.encode(request.getPassword()));
//        } else {
//            // Nếu không có password mới, giữ nguyên mật khẩu cũ
//            user.setPassword(originalPassword);
//        }
//
//        // Lưu user đã cập nhật vào cơ sở dữ liệu
//        User updatedUser = userRepository.save(user);
//
//        // Ánh xạ user thành UserResponse và trả về
//        return userMapper.toUserResponse(updatedUser);
        // Tìm user theo ID
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lưu mật khẩu cũ
        String originalPassword = user.getPassword();

        // Cập nhật các trường từ request
        userMapper.updateUser(user, request);

        // Xử lý vai trò: chỉ lấy vai trò đầu tiên từ Set<String> roles
        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            HashSet<String> roles = new HashSet<>();
            String role = request.getRoles().iterator().next(); // Lấy vai trò đầu tiên
            if (Role.ADMIN.name().equalsIgnoreCase(role) || Role.USER.name().equalsIgnoreCase(role)) {
                roles.add(role.toUpperCase()); // Chuyển vai trò thành chữ hoa để đồng nhất
            } else {
                roles.add(Role.USER.name()); // Mặc định là USER nếu vai trò không hợp lệ
            }
            user.setRoles(roles);
        }

        // Cập nhật mật khẩu nếu có giá trị mới
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        } else {
            user.setPassword(originalPassword);
        }

        // Lưu user đã cập nhật vào cơ sở dữ liệu
        User updatedUser = userRepository.save(user);

        // Ánh xạ sang UserResponse và trả về
        return userMapper.toUserResponse(updatedUser);

    }
    public void deleteUser(String id){
        userRepository.deleteById(id);
    }
}
