package com.app.service;

import java.util.List;

import com.app.dto.CourseTypeReqDto;
import com.app.dto.CourseTypeRespDto;

public interface CourseTypeService {

	// create

	public CourseTypeRespDto createCourseType(CourseTypeReqDto courseTypeDto);

	// update

	public CourseTypeRespDto updateCourseType(Integer courseTypeId, CourseTypeReqDto courseTypeDto);

	// delete

	public void deleteCourseType(Integer courseTypeId);

	// find CourseTypeById

	public CourseTypeRespDto getCourseTypeById(Integer courseTypeId);

	// findAll

	public List<CourseTypeRespDto> getAllCourseTypes();

}
