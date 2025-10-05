package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.SubjectReqDto;
import com.app.dto.SubjectRespDto;
import com.app.service.SubjectService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin("*")
public class SubjectController {

	@Autowired
	private final SubjectService subjectService;

	public SubjectController(SubjectService subjectService) {
		this.subjectService = subjectService;
	}

	@PostMapping
	public ResponseEntity<SubjectRespDto> addSubject(@RequestBody SubjectReqDto dto) {
		return ResponseEntity.ok(subjectService.addSubject(dto));
	}

	@GetMapping
	public List<SubjectRespDto> getAllSubjects() {
		return subjectService.getAllSubjects();

	}

	@GetMapping("/{id}")
	public ResponseEntity<SubjectRespDto> getSubjectById(@PathVariable int id) {
		return ResponseEntity.ok(subjectService.getSubjectById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<SubjectRespDto> updateSubject(@PathVariable int id, @RequestBody SubjectReqDto dto) {
		return ResponseEntity.ok(subjectService.updateSubject(id, dto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteSubject(@PathVariable int id) {
		subjectService.deleteSubject(id);

		return ResponseEntity.ok("Subject deleted succeessfully");
	}

}
