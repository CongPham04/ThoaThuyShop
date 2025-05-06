package com.devteria.identify_service.exception;

public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999,"uncategorized exception"),
    INVALD_KEY(1001,"invalid message key"),
    USER_EXISTED(1002,"user already exists"),
    USER_INVALID(1003,"Username must be at least 3 characters"),
    INVALID_PASSWORD(1004,"Password must be at least 8 characters"),
    USER_NOT_EXISTED(1005,"user not existed"),
    UNAUTHORIZED_ACCESS(1006,"unauthorized access"),
    ACCESS_DENIED(1007,"You do not have permission to access this resource."),
    INVALID_CREDENTIALS(1008,"Invalid credentials provided."),
    INVALID_EMAIL(1009, "Invalid email format"),
    EMAIL_EXISTED(1010, "Email already exists");
    ;
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
