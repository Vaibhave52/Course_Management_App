package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.app.dto.CourseTypeReqDto;
import com.app.dto.CourseTypeRespDto;
import com.app.responsemessage.ApiResponse;
import com.app.service.CourseTypeService;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin("*")
@RestController
@RequestMapping("/coursetype")
@Slf4j
public class CourseTypeController {

	@Autowired
	private CourseTypeService courseTypeService;

	// create

	@PostMapping
	public ResponseEntity<CourseTypeRespDto> createCourseType(@RequestBody CourseTypeReqDto courseTypeDto) {

		log.info("CourseTypeController Layer Description  : {}, Tittle :{}", courseTypeDto.getDescription(),
				courseTypeDto.getTitle());

		return new ResponseEntity<CourseTypeRespDto>(courseTypeService.createCourseType(courseTypeDto),
				HttpStatus.CREATED);

	}

	// update

	@PutMapping("/{courseTypeId}")
	public ResponseEntity<CourseTypeRespDto> updateCourseType(@RequestBody CourseTypeReqDto courseTypeDto,
			@PathVariable(name = "courseTypeId") Integer courseTypeId) {

		log.info("CourseTypeController Layer {}", courseTypeId);

		return new ResponseEntity<CourseTypeRespDto>(courseTypeService.updateCourseType(courseTypeId, courseTypeDto),
				HttpStatus.OK);

	}

	// getAll

	@GetMapping()
	public ResponseEntity<List<CourseTypeRespDto>> getAllCourseType() {

		log.info("CourseTypeController Layer get All CourseType");

		return new ResponseEntity<List<CourseTypeRespDto>>(courseTypeService.getAllCourseTypes(), HttpStatus.OK);

	}

	// getById

	@GetMapping("/{courseTypeId}")
	public ResponseEntity<CourseTypeRespDto> getCourseTypeById(
			@PathVariable(name = "courseTypeId") Integer courseTypeId) {

		log.info("In controller layer coursetype id is {}", courseTypeId);

		return new ResponseEntity<CourseTypeRespDto>(courseTypeService.getCourseTypeById(courseTypeId), HttpStatus.OK);

	}

	// delete

	@DeleteMapping("/{courseTypeId}")
	public ResponseEntity<ApiResponse> deleteCourseTypeById(@PathVariable(name = "courseTypeId") Integer courseTypeId) {

		courseTypeService.deleteCourseType(courseTypeId);

		log.info("CourseTypeController Layer {}", courseTypeId);

		ApiResponse deleteMeassage = ApiResponse.builder()
				.message("Coursetype deleted Successfully with id :" + courseTypeId).status(HttpStatus.OK).build();

		return new ResponseEntity<ApiResponse>(deleteMeassage, HttpStatus.OK);

	}

}
