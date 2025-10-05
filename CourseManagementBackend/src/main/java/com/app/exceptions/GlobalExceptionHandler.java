package com.app.exceptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.app.responsemessage.ApiResponse;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	// 404 - Resource Not Found
	@ExceptionHandler(ResourseNotFoundException.class)
	public ResponseEntity<ApiResponse> handleResourceNotFound(ResourseNotFoundException ex) {
		ApiResponse response = ApiResponse.builder().message(ex.getMessage()).status(HttpStatus.NOT_FOUND)
				.statusCode(HttpStatus.NOT_FOUND.value()).errorCode("RESOURCE_NOT_FOUND").timestamp(LocalDateTime.now())
				.build();

		log.warn("Resource not found: {}", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	// 403 - Access Denied
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse> handleAccessDenied(AccessDeniedException ex) {
		ApiResponse response = ApiResponse.builder().message("You don’t have permission to access this resource")
				.status(HttpStatus.FORBIDDEN).statusCode(HttpStatus.FORBIDDEN.value()).errorCode("ACCESS_DENIED")
				.timestamp(LocalDateTime.now()).build();

		log.warn("Access denied: {}", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
	}

	// 409 - Database Constraint / Duplicate Keys
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
		ApiResponse response = ApiResponse.builder()
				.message("Database error: " + ex.getMostSpecificCause().getMessage()).status(HttpStatus.CONFLICT)
				.statusCode(HttpStatus.CONFLICT.value()).errorCode("DATA_INTEGRITY_VIOLATION")
				.timestamp(LocalDateTime.now()).build();

		log.error("Data integrity violation: {}", ex.getMessage());
		return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}

	// 🔹 5. Unsupported HTTP Method (405)
	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ApiResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
		String supportedMethods = (ex.getSupportedHttpMethods() != null) ? ex.getSupportedHttpMethods().toString()
				: "N/A";

		ApiResponse response = ApiResponse.builder()
				.message("HTTP method " + ex.getMethod() + " not supported. Supported methods: " + supportedMethods)
				.status(HttpStatus.METHOD_NOT_ALLOWED).statusCode(HttpStatus.METHOD_NOT_ALLOWED.value())
				.errorCode("METHOD_NOT_ALLOWED").timestamp(LocalDateTime.now()).build();

		log.warn("Method not supported: {}. Supported: {}", ex.getMethod(), supportedMethods);
		return new ResponseEntity<>(response, HttpStatus.METHOD_NOT_ALLOWED);
	}
	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiResponse> handleIllegalState(IllegalStateException ex) {
	    ApiResponse response = ApiResponse.builder()
	            .message(ex.getMessage())
	            .status(HttpStatus.CONFLICT)
	            .statusCode(HttpStatus.CONFLICT.value())
	            .timestamp(LocalDateTime.now())
	            .build();

	    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
	}

	// 500 - Internal Server Error (Catch-All)
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse> handleGlobalException(Exception ex) {
		ApiResponse response = ApiResponse.builder().message("An unexpected error occurred: " + ex.getMessage())
				.status(HttpStatus.INTERNAL_SERVER_ERROR).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
				.errorCode("INTERNAL_SERVER_ERROR").timestamp(LocalDateTime.now()).build();

		log.error("Unhandled exception: {}", ex.getMessage(), ex);
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
