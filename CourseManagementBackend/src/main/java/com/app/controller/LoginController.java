package com.app.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dao.StaffDao;
import com.app.dto.LoginRequest;
import com.app.dto.LoginResponse;
import com.app.dto.ResetPasswordRequest;
import com.app.dto.LoginResponse;
import com.app.dto.StaffReqDto;
import com.app.dto.StaffRespDto;
import com.app.entity.Staff;
import com.app.service.LoginService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/login")
@CrossOrigin("*")
@Slf4j
public class LoginController {

	@Autowired
	private LoginService loginService;

	@Autowired
	private StaffDao staffDao;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// ------------------ Login -------------------
	@PostMapping
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

		log.error("Email Id {} and paswword {}", request.getEmail(), request.getPassword());

		System.out.println("email id is " + request.getEmail());
		LoginResponse response = loginService.login(request);

		return ResponseEntity.ok(response);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
		// 1️ Basic logging
		log.info("Received password reset request for email: {}", request.getEmail());

		// 2️ Validate request
		if (request.getEmail() == null || request.getEmail().isEmpty()) {
			return ResponseEntity.badRequest().body("Email is required");
		}
		if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
			return ResponseEntity.badRequest().body("New password must be at least 6 characters");
		}

		// 3️ Find user by email
		Optional<Staff> staffOpt = staffDao.findByEmail(request.getEmail());

		if (staffOpt.isEmpty()) {
			log.warn("Password reset failed. Email not found: {}", request.getEmail());
			return ResponseEntity.status(404).body("User not found with this email");
		}

		// 4️ Update password
		Staff staff = staffOpt.get();
		staff.setPassword(passwordEncoder.encode(request.getNewPassword()));
		staffDao.save(staff);

		log.info("Password reset successfully for email: {}", staff.getEmail());

		// 5️ Return success response
		return ResponseEntity.ok("Password reset successfully!");
	}
}