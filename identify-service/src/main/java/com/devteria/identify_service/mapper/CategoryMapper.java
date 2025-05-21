package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.request.CategoryRequest;
import com.devteria.identify_service.dto.response.CategoryResponse;
import com.devteria.identify_service.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "collection", ignore = true)
    Category toCategory(CategoryRequest request);

    @Mapping(source = "collection.id", target = "collectionId")
    @Mapping(source = "collection.name", target = "collectionName")
    CategoryResponse toCategoryResponse(Category category);
}
