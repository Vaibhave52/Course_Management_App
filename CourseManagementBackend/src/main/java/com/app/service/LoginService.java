package com.app.service;
import com.app.dto.LoginRequest;
import com.app.dto.LoginResponse;


public interface LoginService {
	
	public LoginResponse login(LoginRequest request);
	
}
