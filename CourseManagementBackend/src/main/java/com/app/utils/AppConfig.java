package com.app.utils;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.app.dto.CourseModuleReqDto;
import com.app.entity.CourseModule;

@Configuration
public class AppConfig {

	@Bean
	public ModelMapper modelMapper() {
		return new ModelMapper();
	}

	@Bean("courseModuleMapper")
	public ModelMapper modelMapperForCourseModule() {
		ModelMapper modelMapper = new ModelMapper();

		// Use strict matching to avoid automatic ambiguous mappings
		modelMapper.getConfiguration().setAmbiguityIgnored(true);

		modelMapper.typeMap(CourseModuleReqDto.class, CourseModule.class).addMappings(mapper -> {
			mapper.skip(CourseModule::setId); // skip id
			// mapper.skip(CourseModule::setStaff); // optionally skip staff
			// mapper.skip(CourseModule::setCourse); // optionally skip course
		});

		return modelMapper;
	}

}
