package com.app.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.Student;

public interface StudentDao extends JpaRepository<Student, Integer> {

	List<Student> findByCourseId(Integer courseId);
}
