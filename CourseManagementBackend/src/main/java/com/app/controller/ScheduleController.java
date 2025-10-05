package com.app.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.app.dto.ScheduleReqDto;
import com.app.dto.ScheduleRespDto;
import com.app.responsemessage.ApiResponse;
import com.app.service.CourseSecurityService;
import com.app.service.ScheduleService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin("*")
@Slf4j
public class ScheduleController {

	@Autowired
	private ScheduleService scheduleService;

	@Autowired
	private CourseSecurityService courseSecurityService;

	@PostMapping
	@PreAuthorize("@courseSecurity.canAccessCourseModule(#dto.courseModuleId, authentication.name)")
	public ResponseEntity<ScheduleRespDto> addSchedule(@RequestBody ScheduleReqDto dto) {

		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		log.info("Creating schedule for moduleId {} by {}", dto.getCourseModuleId(), email);

		return new ResponseEntity<>(scheduleService.addSchedule(dto), HttpStatus.OK);
	}

	// Anyone with COORDINATOR or ADMIN can view all

	@GetMapping
	@PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
	public ResponseEntity<List<ScheduleRespDto>> getAllSchedules(Authentication authentication) {
		String email = authentication.getName();
		List<ScheduleRespDto> allSchedules = scheduleService.getAllSchedules();

		// Filter for coordinator
		if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COORDINATOR"))) {
			allSchedules = allSchedules.stream()
					.filter(s -> courseSecurityService.canAccessCourseModule(s.getCourseModuleId(), email)).toList();
		}

		return ResponseEntity.ok(allSchedules);
	}

	@GetMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessSchedule(#id, authentication.name)")
	public ResponseEntity<ScheduleRespDto> getSchedule(@PathVariable int id) {
		return ResponseEntity.ok(scheduleService.getSchedule(id));
	}

	// COORDINATOR can update schedules

	@PutMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessCourseModule(#dto.courseModuleId, authentication.name)")
	public ResponseEntity<ApiResponse> deleteScheduleById(@PathVariable Integer id) {
		scheduleService.deleteSchedule(id);
		ApiResponse apiResponse = ApiResponse.builder().message("Schedule deleted by id: " + id).status(HttpStatus.OK)
				.statusCode(200).timestamp(LocalDateTime.now()).build();
		return ResponseEntity.ok(apiResponse);
	}

	// COORDINATOR can delete schedules

	@DeleteMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessSchedule(#id, authentication.name)")
	public ResponseEntity<String> deleteSchedule(@PathVariable int id) {
		scheduleService.deleteSchedule(id);
		return ResponseEntity.ok("Schedule deleted");
	}

	@GetMapping("/report")
	@PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
	public List<ScheduleRespDto> getScheduleReport(
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
			Authentication authentication) {

		String email = authentication.getName();

		// Fetch report from service
		List<ScheduleRespDto> allReports = scheduleService.getScheduleReport(start, end);

		// If user is a coordinator, filter only the schedules for modules they have
		// access to
		if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COORDINATOR"))) {

			allReports = allReports.stream().filter(s -> s.getCourseModuleId() != null)
					.filter(s -> courseSecurityService.canAccessCourseModule(s.getCourseModuleId(), email)).toList();
		}

		return allReports;
	}

}
