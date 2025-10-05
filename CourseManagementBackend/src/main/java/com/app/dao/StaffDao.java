package com.app.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.Staff;

public interface StaffDao extends JpaRepository<Staff, Integer> {

	Optional<Staff> findByEmailAndPassword(String email, String password);

	Optional<Staff> findByEmail(String email);

	Optional<Staff> findByName(String name);

}
