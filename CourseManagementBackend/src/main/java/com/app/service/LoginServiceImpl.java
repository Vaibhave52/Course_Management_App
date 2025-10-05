package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.dao.RoleDao;
import com.app.dao.StaffDao;
import com.app.dto.LoginRequest;
import com.app.dto.LoginResponse;
import com.app.entity.Staff;
import com.app.exceptions.ResourseNotFoundException;
import com.app.utils.JwtUtils;

@Service
public class LoginServiceImpl implements LoginService{
	@Autowired
	private StaffDao staffDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtUtils jwtUtils;

	@Override
	public LoginResponse login(LoginRequest request) {
		// Authenticate user
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

		Staff staff = staffDao.findByEmail(request.getEmail())
				.orElseThrow(() -> new ResourseNotFoundException("User not found with email " + request.getEmail()));

		String token = jwtUtils.generateToken(staff.getEmail(), staff.getRole().getName(), staff.getName());

		return new LoginResponse(token, staff.getEmail(), staff.getRole().getName(), staff.getName());
	}

}
