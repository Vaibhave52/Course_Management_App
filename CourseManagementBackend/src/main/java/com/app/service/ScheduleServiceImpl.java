package com.app.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.CourseModuleDao;
import com.app.dao.GroupDao;
import com.app.dao.InfrastuctureDao;
import com.app.dao.ScheduleDao;
import com.app.dao.StaffDao;
import com.app.dto.ScheduleReqDto;

import com.app.dto.ScheduleRespDto;
import com.app.entity.CourseModule;
import com.app.entity.Group;
import com.app.entity.Infrastructure;
import com.app.entity.Schedule;
import com.app.entity.Staff;

@Service
@Transactional
public class ScheduleServiceImpl implements ScheduleService {

	@Autowired
	private ScheduleDao scheduleDao;

	@Autowired
	private CourseModuleDao courseModuleDao;

	@Autowired
	private InfrastuctureDao infrastructureDao;

	@Autowired
	private GroupDao groupDao;

	@Autowired
	private StaffDao staffDao;

	public ScheduleRespDto addSchedule(ScheduleReqDto dto) {

		Schedule schedule = new Schedule();

		schedule.setDate(dto.getDate());
		schedule.setStartTime(dto.getStartTime());
		schedule.setEndTime(dto.getEndTime());
		schedule.setComment(dto.getComment());

		CourseModule module = courseModuleDao.findById(dto.getCourseModuleId())
				.orElseThrow(() -> new RuntimeException("Module not found"));
		schedule.setCourseModule(module);

		List<Infrastructure> infraList = dto.getInfrastructureId().stream().map(infra -> infrastructureDao
				.findById(infra).orElseThrow(() -> new RuntimeException("Infrastructure not found by id " + infra)))
				.toList();

		schedule.setInfrastructures(infraList);

		List<Group> groupList = dto.getGroupIds().stream().map(group -> groupDao.findById(group)
				.orElseThrow(() -> new RuntimeException("Group not found by id " + group))).toList();

		schedule.setGroups(groupList);

		List<Staff> staffList = dto.getStaffId().stream().map(staff -> staffDao.findById(staff)
				.orElseThrow(() -> new RuntimeException("staff not found by id " + staff))).toList();

		schedule.setStaff(staffList);

		Schedule save = scheduleDao.save(schedule);

		return convertToScheduleRespDto(save);
	}

	private ScheduleRespDto convertToScheduleRespDto(Schedule s) {
		ScheduleRespDto dto = new ScheduleRespDto();

		dto.setId(s.getId());
		dto.setDate(s.getDate());
		dto.setStartTime(s.getStartTime());
		dto.setEndTime(s.getEndTime());
		dto.setCourseModuleId(s.getCourseModule().getId()); // <-- Add this
		dto.setModuleName(s.getCourseModule().getTitle());
		dto.setComment(s.getComment());
		dto.setInfrastructureName(s.getInfrastructures().stream().map(infra -> infra.getTitle()).toList());
		dto.setGroupName(s.getGroups().stream().map(group -> group.getGroupName()).toList());
		dto.setStaffName(s.getStaff().stream().map(staff -> staff.getName()).collect(Collectors.toList()));

		return dto;
	}

	public List<ScheduleRespDto> getAllSchedules() {

		List<Schedule> all = scheduleDao.findAll();

		return all.stream().map(s -> convertToScheduleRespDto(s)).toList();
	}

	public ScheduleRespDto getSchedule(int id) {

		Schedule schedule = scheduleDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Schedule not found by id " + id));

		return convertToScheduleRespDto(schedule);
	}

	public ScheduleRespDto updateSchedule(int id, ScheduleReqDto dto) {

		Schedule schedule = scheduleDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Schedule not found by id " + id));

		schedule.setDate(dto.getDate());
		schedule.setStartTime(dto.getStartTime());
		schedule.setEndTime(dto.getEndTime());
		schedule.setComment(dto.getComment());

		CourseModule module = courseModuleDao.findById(dto.getCourseModuleId())
				.orElseThrow(() -> new RuntimeException("Module not found"));
		schedule.setCourseModule(module);

		List<Infrastructure> infraList = dto.getInfrastructureId().stream()
				.map(infra -> infrastructureDao.findById(infra)
						.orElseThrow(() -> new RuntimeException("Infrastructure not found by id " + infra)))
				.collect(Collectors.toList());

		schedule.setInfrastructures(infraList);

		List<Group> groupList = dto.getGroupIds().stream()
				.map(group -> groupDao.findById(group)
						.orElseThrow(() -> new RuntimeException("Group not found by id " + group)))
				.collect(Collectors.toList());

		schedule.setGroups(groupList);

		List<Staff> staffList = dto.getStaffId().stream()
				.map(staff -> staffDao.findById(staff)
						.orElseThrow(() -> new RuntimeException("staff not found by id " + staff)))
				.collect(Collectors.toList());

		schedule.setStaff(staffList);

		Schedule save = scheduleDao.save(schedule);

		return convertToScheduleRespDto(save);
	}

	public void deleteSchedule(int id) {
		Schedule schedule = scheduleDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Schedule not found by id " + id));

		// Clear ManyToMany relationships first
		schedule.getStaff().clear();
		schedule.getGroups().clear();
		schedule.getInfrastructures().clear();

		// Now delete the schedule
		scheduleDao.delete(schedule);
	}

	public List<ScheduleRespDto> getScheduleReport(LocalDate start, LocalDate end) {

		List<Schedule> schedules = scheduleDao.getScheduleReport(start, end);

		return schedules.stream().map(s -> convertToScheduleRespDto(s)).toList();
	}

}
