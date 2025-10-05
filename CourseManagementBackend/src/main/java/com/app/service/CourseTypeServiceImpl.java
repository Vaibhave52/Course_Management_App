package com.app.service;

import java.util.List;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.app.dao.CourseTypeDao;
import com.app.dto.CourseTypeReqDto;
import com.app.dto.CourseTypeRespDto;
import com.app.entity.CourseType;
import com.app.exceptions.ResourseNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CourseTypeServiceImpl implements CourseTypeService {

	@Autowired
	private CourseTypeDao courseTypeRepository;

	@Autowired
	private ModelMapper modelMapper;


	@Override
	public CourseTypeRespDto createCourseType(CourseTypeReqDto courseTypeDto) {

		CourseType courseType = modelMapper.map(courseTypeDto, CourseType.class);

		CourseType savedCourseType = courseTypeRepository.save(courseType);

		log.info("Service layer title : {}, description : {}", courseType.getTitle(), courseType.getDescription());

		return modelMapper.map(savedCourseType, CourseTypeRespDto.class);

	}

	@Override
	public CourseTypeRespDto updateCourseType(Integer courseTypeId, CourseTypeReqDto updatedcourseTypeDto) {

		CourseType courseType = courseTypeRepository.findById(courseTypeId).orElseThrow(

				() -> new ResourseNotFoundException("CourseType is not found with given Id: " + courseTypeId));

		courseType.setTitle(updatedcourseTypeDto.getTitle());

		courseType.setDescription(updatedcourseTypeDto.getDescription());

		CourseType savedCourseType = courseTypeRepository.save(courseType);

		return modelMapper.map(savedCourseType, CourseTypeRespDto.class);

	}

	@Override
	public void deleteCourseType(Integer courseTypeId) {

		CourseType courseType = courseTypeRepository.findById(courseTypeId).orElseThrow(

				() -> new ResourseNotFoundException("CourseType is not found with given Id: " + courseTypeId));

		log.info("In Service  layer coursetype deleted having id {}", courseTypeId);

		courseTypeRepository.delete(courseType);

	}

	@Override
	public CourseTypeRespDto getCourseTypeById(Integer courseTypeId) {

		log.info("In Service  layer coursetype id is {}", courseTypeId);

		CourseType courseType = courseTypeRepository.findById(courseTypeId).orElseThrow(
				() -> new ResourseNotFoundException("CourseType is not found with given Id: " + courseTypeId));

		log.info("In Service  layer coursetype id is {}", courseType.getId());

		return modelMapper.map(courseType, CourseTypeRespDto.class);

	}

	@Override
	public List<CourseTypeRespDto> getAllCourseTypes() {

		log.info("In Service  layer getAllCourseType");

		List<CourseType> courseTypesList = courseTypeRepository.findAll();

		return courseTypesList.stream().map(courseType -> modelMapper.map(courseType, CourseTypeRespDto.class))
				.collect(Collectors.toList());
	}

}
