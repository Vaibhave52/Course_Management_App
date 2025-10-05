package com.app.dao;
import java.util.Optional;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.Role;

public interface RoleDao extends JpaRepository<Role, Integer> {

	Optional<Role> findByName(String name);

}
