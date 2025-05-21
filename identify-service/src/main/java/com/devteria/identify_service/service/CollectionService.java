package com.devteria.identify_service.service;
import com.devteria.identify_service.dto.request.CollectionRequest;
import com.devteria.identify_service.dto.response.CollectionResponse;
import com.devteria.identify_service.entity.Collection;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.CollectionMapper;
import com.devteria.identify_service.repository.CollectionRepository;
import lombok.*;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CollectionService {
    CollectionRepository collectionRepository;
    CollectionMapper collectionMapper;
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CollectionResponse createCollection(CollectionRequest request) {
        Collection collection = collectionMapper.toCollection(request);
        collection = collectionRepository.save(collection);
        return collectionMapper.toCollectionResponse(collection);
    }

    public List<CollectionResponse> getAllCollections() {
        return collectionRepository.findAll().stream()
                .map(collectionMapper::toCollectionResponse)
                .toList();
    }

    public CollectionResponse getCollection(Long id) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COLLECTION_NOT_FOUND));
        return collectionMapper.toCollectionResponse(collection);
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CollectionResponse updateCollection(Long id, CollectionRequest request) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COLLECTION_NOT_FOUND));

        collection.setName(request.getName());
        collection = collectionRepository.save(collection);
        return collectionMapper.toCollectionResponse(collection);
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public void deleteCollection(Long id) {
        if (!collectionRepository.existsById(id)) {
            throw new AppException(ErrorCode.COLLECTION_NOT_FOUND);
        }
        collectionRepository.deleteById(id);
    }
}
