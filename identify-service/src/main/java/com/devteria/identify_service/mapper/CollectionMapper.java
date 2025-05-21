package com.devteria.identify_service.mapper;
import com.devteria.identify_service.dto.request.CollectionRequest;
import com.devteria.identify_service.dto.response.CollectionResponse;
import com.devteria.identify_service.entity.Collection;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public interface CollectionMapper {
    Collection toCollection(CollectionRequest request);

    CollectionResponse toCollectionResponse(Collection collection);
}
