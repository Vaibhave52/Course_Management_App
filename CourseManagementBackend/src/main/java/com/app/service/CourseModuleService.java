package com.app.service;

import java.util.List;

import com.app.dto.CourseModuleReqDto;
import com.app.dto.CourseModuleRespDto;


public interface CourseModuleService {
	 
	CourseModuleRespDto addCourseModule(CourseModuleReqDto courseModule);
	
	CourseModuleRespDto updateCourseModule(Integer id, CourseModuleReqDto courseModule);
	    
	void deleteCourseModule(Integer id);
	    
	CourseModuleRespDto getCourseModuleById(Integer id);
	    
	List<CourseModuleRespDto> getAllCourseModules();
}
