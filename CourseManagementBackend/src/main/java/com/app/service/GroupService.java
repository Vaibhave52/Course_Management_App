package com.app.service;

import java.util.List;

import com.app.dto.GroupReqDto;
import com.app.dto.GroupRespDto;

public interface GroupService {

	//add
	
	public GroupRespDto addCourseGroup(GroupReqDto courseGroupDto);
	
	// update
	
	public GroupRespDto updateCourseGroup(GroupReqDto courseGroupDto,Integer id);
	
	// delete
	
	public void deleteCourseGroup(Integer id);
	
	// get by id
	
	public GroupRespDto getCourseGroupById(Integer id);
	
	// get all Course group
	
	public List<GroupRespDto> getAllCourseGroup();
}
