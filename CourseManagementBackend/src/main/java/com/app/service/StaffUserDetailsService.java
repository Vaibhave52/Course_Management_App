package com.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.app.dao.StaffDao;
import com.app.entity.Staff;
import com.app.exceptions.ResourseNotFoundException;
import com.app.utils.StaffUserDetails;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffUserDetailsService implements UserDetailsService {

	@Autowired
	private final StaffDao staffDao;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

		Staff staff = staffDao.findByEmail(email)
				.orElseThrow(() -> new ResourseNotFoundException("User not found with email : " + email));

		System.out.println(staff);

		return new StaffUserDetails(staff);
	}

}
