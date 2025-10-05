package com.app.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.CourseDao;
import com.app.dao.GroupDao;
import com.app.dto.GroupReqDto;
import com.app.dto.GroupRespDto;
import com.app.entity.Course;
import com.app.entity.Group;
import com.app.exceptions.ResourseNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class GroupServiceImpl implements GroupService {

	@Autowired
	private GroupDao courseGroupRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private CourseDao courseRepository;

	@Override
	public GroupRespDto addCourseGroup(GroupReqDto courseGroupDto) {

		Course course = courseRepository.findById(courseGroupDto.getCourseId()).orElseThrow(() ->

		new ResourseNotFoundException(

				"Course is not present in database with given Id:" + courseGroupDto.getCourseId()));

		Group courseGroup = modelMapper.map(courseGroupDto, Group.class);
		
		courseGroup.setId(null);

		courseGroup.setCourse(course);

		log.info("Service Layer Course GroupName {} GroupdId {} CourseName {} ", courseGroup.getGroupName(),
				courseGroup.getId(), courseGroup.getCourse().getName());

		Group group = courseGroupRepository.save(courseGroup);

		return modelMapper.map(group, GroupRespDto.class);
	}

	@Override
	public GroupRespDto updateCourseGroup(GroupReqDto courseGroupDto, Integer id) {

		Group courseGroup = courseGroupRepository.findById(id)
				.orElseThrow(() -> new ResourseNotFoundException("Course group is not found with given id : " + id));

		courseGroup.setGroupName(courseGroupDto.getGroupName());

		if (courseGroupDto.getCourseId() != null) {

			Course course = courseRepository.findById(courseGroupDto.getCourseId())

					.orElseThrow(() -> new ResourseNotFoundException(

							"Course is not present in database with given Id:" + courseGroupDto.getCourseId()));

			courseGroup.setCourse(course);
		}

		log.info("Service Layer update Course GroupName {} groupId {} courseName {}", courseGroup.getGroupName(),
				courseGroup.getId(), courseGroup.getCourse().getName());

		Group group = courseGroupRepository.save(courseGroup);

		return modelMapper.map(group, GroupRespDto.class);

	}

	@Override
	public void deleteCourseGroup(Integer id) {

		Group courseGroup = courseGroupRepository.findById(id)
				.orElseThrow(() -> new ResourseNotFoundException("Course group is not found with given id : " + id));

		log.info("Service Layer delete Course Group with id {} ", id);

		courseGroupRepository.delete(courseGroup);
	}

	@Override
	public GroupRespDto getCourseGroupById(Integer id) {

		Group courseGroup = courseGroupRepository.findById(id)
				.orElseThrow(() -> new ResourseNotFoundException("Course group is not found with given id : " + id));

		log.info("Service Layer getCourseGroup with id {} ", id);
		
		return modelMapper.map(courseGroup, GroupRespDto.class);
	}

	@Override
	public List<GroupRespDto> getAllCourseGroup() {

		List<Group> list = courseGroupRepository.findAll();
		
		return list.stream().map(group -> modelMapper.map(group, GroupRespDto.class)).toList();

	}

}
