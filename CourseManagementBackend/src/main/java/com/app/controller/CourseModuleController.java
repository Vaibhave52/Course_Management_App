package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.CourseModuleReqDto;
import com.app.dto.CourseModuleRespDto;
import com.app.service.CourseModuleService;
import com.app.service.CourseSecurityService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/course-modules")
@CrossOrigin("*")
@Slf4j
public class CourseModuleController {

	@Autowired
	private CourseModuleService courseModuleService;

	@Autowired
	private CourseSecurityService courseSecurityService;

	@PostMapping
	@PreAuthorize("@courseSecurity.canAccessCourse(#courseModule.courseId, authentication.name)")
	public ResponseEntity<CourseModuleRespDto> addCourseModule(@RequestBody CourseModuleReqDto courseModule) {

		return ResponseEntity.ok(courseModuleService.addCourseModule(courseModule));
	}

	@GetMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessCourseModule(#id, authentication.name)")
	public ResponseEntity<CourseModuleRespDto> getCourseModule(@PathVariable Integer id) {

		return ResponseEntity.ok(courseModuleService.getCourseModuleById(id));
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
	public ResponseEntity<List<CourseModuleRespDto>> getAllCourseModules(Authentication authentication) {

		String email = authentication.getName();

		List<CourseModuleRespDto> allCourseModules = courseModuleService.getAllCourseModules();
		// Filter for coordinator
		boolean isCoordinator = authentication.getAuthorities().stream()
				.anyMatch(auth -> auth.getAuthority().equals("ROLE_COORDINATOR"));

		if (isCoordinator) {
			allCourseModules = allCourseModules.stream().filter(m -> m.getCourseIds().stream()
					.anyMatch(courseId -> courseSecurityService.canAccessCourse(courseId, email))).toList();
		}

		log.info("Returning {} modules for user {}", allCourseModules.size(), email);

		return ResponseEntity.ok(allCourseModules);
	}

	@PutMapping("/{id}")
	@PreAuthorize(" @courseSecurity.canAccessCourseModule(#id, authentication.name)")
	public ResponseEntity<CourseModuleRespDto> updateCourseModule(@PathVariable Integer id,
			@RequestBody CourseModuleReqDto courseModule) {
		return ResponseEntity.ok(courseModuleService.updateCourseModule(id, courseModule));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessModuleByModuleId(#id, authentication.name)")
	public ResponseEntity<String> deleteCourseModule(@PathVariable Integer id) {

		courseModuleService.deleteCourseModule(id);

		return ResponseEntity.ok("Course Module deleted successfully");
	}
}
