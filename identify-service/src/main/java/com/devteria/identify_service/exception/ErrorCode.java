package com.devteria.identify_service.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "uncategorized exception"),
    INVALD_KEY(1001, "invalid message key"),
    USER_EXISTED(1002, "user already exists"),
    USER_INVALID(1003, "Username must be at least 3 characters"),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters"),
    USER_NOT_EXISTED(1005, "user not existed"),
    UNAUTHORIZED_ACCESS(1006, "unauthorized access"),
    ACCESS_DENIED(1007, "You do not have permission to access this resource."),
    INVALID_CREDENTIALS(1008, "Invalid credentials provided."),
    INVALID_EMAIL(1009, "Invalid email format"),
    EMAIL_EXISTED(1010, "Email already exists"),
    INVALID_GENDER(1011, "Invalid gender"),
    COLLECTION_NOT_FOUND(2001, "Collection not found"),
    CATEGORY_NOT_FOUND(3001, "Category not found"),
    PRODUCT_NOT_FOUND(4001, "Product not found"),
    PRODUCT_NAME_EXISTS(4002, "Product name already exists"),
    NAME_REQUIRED(4003, "Product name is required"),
    PRICE_REQUIRED(4004, "Product price is required"),
    PRICE_INVALID(4005, "Price must be non-negative"),
    CATEGORY_ID_REQUIRED(4006, "Category ID is required"),
    CART_NOT_FOUND(5001, "Cart not found"),
    CART_ITEM_NOT_FOUND(5002, "Cart item not found"),
    CART_EMPTY(5003, "Cart is empty"),
    ORDER_NOT_FOUND(6001, "Order not found"),
    ORDER_CANNOT_BE_CANCELLED(6002, "Order cannot be cancelled"),
    INVALID_SHIPPING_INFO(6003, "Shipping information is invalid or missing"), // Added for invalid shipping info
    INVALID_QUANTITY(6004, "Quantity must be greater than zero"), // Added for invalid quantity
    ORDER_ITEMS_EMPTY(6005, "Order must contain at least one item"), // Added for empty order items
    NOT_AUTHORIZED(9001, "Not authorized"),
    IMAGE_NOT_FOUND(7001, "Image not found"),
    INVALID_INPUT(6007, "Invalid input" ),
    ORDER_CANNOT_BE_CONFIRME(6008, "Order cannot be confirmed"),;
    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}