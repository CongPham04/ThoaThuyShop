package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.request.UserCreationRequest;
import com.devteria.identify_service.dto.request.UserUpdateRequest;
import com.devteria.identify_service.dto.response.UserResponse;
import com.devteria.identify_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest userCreationRequest);
//    @Mapping(source = "firstName", target = "lastName") lastName = firtName
//    @Mapping(target = "lastName", ignore = true) -> lastName=null
    UserResponse toUserResponse(User user);
    @Mapping(target = "password", ignore = true) // Bỏ qua ánh xạ password trong update
    void updateUser(@MappingTarget User user, UserUpdateRequest userUpdateRequest);
}
