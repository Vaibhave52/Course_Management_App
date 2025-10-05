package com.app.utils;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.app.entity.Course;
import com.app.entity.Staff;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public class StaffUserDetails implements UserDetails {

	@Autowired
	private final Staff staff;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		// Role must be prefixed with "ROLE_"

		return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + staff.getRole().getName()));
	}

	@Override
	public String getPassword() {
		// TODO Auto-generated method stub
		return staff.getPassword();
	}

	@Override
	public String getUsername() {
		// TODO Auto-generated method stub
		return staff.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true; // can add logic later if needed
	}

	@Override
	public boolean isAccountNonLocked() {
		return true; // can add logic later if needed
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true; // can add logic later if needed
	}

	@Override
	public boolean isEnabled() {
		return true; // can add active flag in Staff if needed
	}

	public String getName() {
		return staff.getName();
	}

	public String getRole() {
		return staff.getRole().getName();
	}

	public String getEmail() {
		return staff.getEmail();
	}

}
