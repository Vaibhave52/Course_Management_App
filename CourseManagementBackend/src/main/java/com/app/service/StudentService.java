package com.app.service;

import java.util.List;

import com.app.dto.StudentReqDto;
import com.app.dto.StudentRespDto;

public interface StudentService {

	StudentRespDto addStudent(StudentReqDto student);

	StudentRespDto updateStudent(Integer id, StudentReqDto student);

	void deleteStudent(Integer id);

	StudentRespDto getStudentById(Integer id);

	List<StudentRespDto> getAllStudents();
}
