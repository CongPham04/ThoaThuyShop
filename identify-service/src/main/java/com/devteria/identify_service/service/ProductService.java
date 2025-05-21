package com.devteria.identify_service.service;

import com.devteria.identify_service.dto.request.ProductRequest;
import com.devteria.identify_service.dto.response.ProductResponse;
import com.devteria.identify_service.entity.Category;
import com.devteria.identify_service.entity.Product;
import com.devteria.identify_service.exception.AppException;
import com.devteria.identify_service.exception.ErrorCode;
import com.devteria.identify_service.mapper.ProductMapper;
import com.devteria.identify_service.repository.CategoryRepository;
import com.devteria.identify_service.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse createProduct(ProductRequest request) throws IOException {
        if (productRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND); // Consider adding PRODUCT_NAME_EXISTS
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Product product = productMapper.toProduct(request);
        product.setCategory(category);

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }

        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    public ProductResponse getProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductResponse(product);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ProductResponse updateProduct(Long productId, ProductRequest request) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!product.getName().equals(request.getName()) && productRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND); // Consider adding PRODUCT_NAME_EXISTS
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        productMapper.updateProduct(product, request);
        product.setCategory(category);

        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            product.setImageName(image.getOriginalFilename());
            product.setImageType(image.getContentType());
            product.setImageData(image.getBytes());
        }

        product = productRepository.save(product);
        return productMapper.toProductResponse(product);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(productId);
    }

    public byte[] getProductImage(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (product.getImageData() == null) {
            throw new AppException(ErrorCode.IMAGE_NOT_FOUND);
        }
        return product.getImageData();
    }

    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        if (categoryId == null) {
            return productRepository.findAll().stream()
                    .map(productMapper::toProductResponse)
                    .toList();
        }
        return productRepository.findByCategoryId(categoryId).stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public ProductResponse getRandomProductByCollection(Long collectionId) {
        List<Product> products = productRepository.findByCategoryCollectionId(collectionId);
        if (products.isEmpty()) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        Random random = new Random();
        Product randomProduct = products.get(random.nextInt(products.size()));
        return productMapper.toProductResponse(randomProduct);
    }
}
