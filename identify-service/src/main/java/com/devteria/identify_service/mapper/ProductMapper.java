package com.devteria.identify_service.mapper;

import com.devteria.identify_service.dto.request.ProductRequest;
import com.devteria.identify_service.dto.response.ProductResponse;
import com.devteria.identify_service.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "imageData", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageData", ignore = true)
    @Mapping(target = "category.id", source = "categoryId")
    void updateProduct(@MappingTarget Product product, ProductRequest request);
}
