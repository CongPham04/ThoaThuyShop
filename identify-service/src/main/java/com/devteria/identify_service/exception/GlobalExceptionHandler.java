package com.devteria.identify_service.exception;

import com.devteria.identify_service.dto.request.ApiRespose;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiRespose> handlingRuntimeException(Exception exception) {
        ApiRespose apiRespose = new ApiRespose();
        apiRespose.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiRespose.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
        return ResponseEntity.badRequest().body(apiRespose);
    }
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiRespose> handlingRuntimeException(AppException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        ApiRespose apiRespose = new ApiRespose();
        apiRespose.setCode(errorCode.getCode());
        apiRespose.setMessage(errorCode.getMessage());
        return ResponseEntity.badRequest().body(apiRespose);
    }
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiRespose> handlingMethodArgumentNotValidException(MethodArgumentNotValidException exception) {
            String enumkey=exception.getFieldError().getDefaultMessage();
            ErrorCode errorCode=ErrorCode.INVALD_KEY;
            try {
                errorCode = ErrorCode.valueOf(enumkey);
            }catch (IllegalArgumentException e){

            }
            ApiRespose apiRespose=new ApiRespose();
            apiRespose.setCode(errorCode.getCode());
            apiRespose.setMessage(errorCode.getMessage());

        return ResponseEntity.badRequest().body(apiRespose);
    }
}
