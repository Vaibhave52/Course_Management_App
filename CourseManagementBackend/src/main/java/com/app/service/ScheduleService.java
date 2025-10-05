package com.app.service;

import java.time.LocalDate;
import java.util.List;

import com.app.dto.ScheduleReqDto;
import com.app.dto.ScheduleRespDto;

public interface ScheduleService {

	public ScheduleRespDto addSchedule(ScheduleReqDto dto);
	
	public List<ScheduleRespDto> getAllSchedules();
	
	public ScheduleRespDto getSchedule(int id);
	
	public ScheduleRespDto updateSchedule(int id, ScheduleReqDto dto);
	
	public void deleteSchedule(int id);

	public List<ScheduleRespDto> getScheduleReport(LocalDate start,LocalDate end);

}
