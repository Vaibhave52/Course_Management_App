package com.app.service;

import java.util.List;

import com.app.dto.StaffReqDto;
import com.app.dto.StaffRespDto;

public interface StaffService {

	StaffRespDto addStaff(StaffReqDto staffDto);

	StaffRespDto updateStaff(StaffReqDto staffDto, int staffId);

	String deleteStaff(int staffId);

	List<StaffRespDto> getAll();

	StaffRespDto getStaff(int staffId);
	
	StaffRespDto getStaffByEmail(String email);
}
