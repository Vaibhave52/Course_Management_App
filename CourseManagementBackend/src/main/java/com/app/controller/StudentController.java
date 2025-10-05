package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.StudentReqDto;
import com.app.dto.StudentRespDto;
import com.app.service.StudentService;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*")
public class StudentController {
	@Autowired
	private StudentService studentService;

	@PostMapping
	public ResponseEntity<StudentRespDto> createStudent(@RequestBody StudentReqDto student) {
		return ResponseEntity.ok(studentService.addStudent(student));
	}

	@GetMapping
	public ResponseEntity<List<StudentRespDto>> getAllStudents() {
		return ResponseEntity.ok(studentService.getAllStudents());
	}

	@GetMapping("/{id}")
	public ResponseEntity<StudentRespDto> getStudentById(@PathVariable Integer id) {
		StudentRespDto student = studentService.getStudentById(id);
		return ResponseEntity.ok(student);
	}

	@PutMapping("/{id}")
	public ResponseEntity<StudentRespDto> updateStudent(@PathVariable Integer id, @RequestBody StudentReqDto student) {
		StudentRespDto updatedStudent = studentService.updateStudent(id, student);
		return updatedStudent != null ? ResponseEntity.ok(updatedStudent) : ResponseEntity.notFound().build();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteStudent(@PathVariable Integer id) {
		studentService.deleteStudent(id);
		return ResponseEntity.ok("Student deleted successfully!");
	}
}
