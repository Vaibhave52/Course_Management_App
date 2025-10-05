package com.app.responsemessage;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse {

	private String message; // Error or success message
	private HttpStatus status; // HTTP status
	private int statusCode; // Numeric status code (e.g., 404, 400)
	private String errorCode; // Optional: custom error code like "USER_NOT_FOUND"
	private LocalDateTime timestamp; // When the error occurred

}
