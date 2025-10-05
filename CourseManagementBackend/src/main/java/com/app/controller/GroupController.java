package com.app.controller;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.app.dto.CourseRespDto;
import com.app.dto.GroupReqDto;
import com.app.dto.GroupRespDto;
import com.app.responsemessage.ApiResponse;
import com.app.service.CourseSecurityService;
import com.app.service.CourseService;
import com.app.service.GroupService;
import com.app.utils.StaffUserDetails;

import lombok.extern.slf4j.Slf4j;

@CrossOrigin("*")
@RestController
@RequestMapping("/coursegroup")
@Slf4j
public class GroupController {

	@Autowired
	private GroupService groupService;

	@Autowired
	private CourseSecurityService courseSecurityService;

	@Autowired
	private CourseService courseService;

	// ------------------- Add Group -------------------

	@PostMapping
	@PreAuthorize("@courseSecurity.canAccessCourse(#dto.courseId,authentication.name)")
	public ResponseEntity<GroupRespDto> addCourseGroup(@RequestBody GroupReqDto dto) {
		log.info("Adding Group: {} for Course: {}", dto.getGroupName(), dto.getCourseId());

		GroupRespDto addedGroup = groupService.addCourseGroup(dto);

		return new ResponseEntity<>(addedGroup, HttpStatus.CREATED);
	}

	// ------------------- Get All Groups

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
	public ResponseEntity<List<GroupRespDto>> getAllCourseGroups(Authentication authentication) {

		String email = authentication.getName();

		List<GroupRespDto> allGroups = groupService.getAllCourseGroup();

		// Filter groups for coordinator only

		StaffUserDetails user = (StaffUserDetails) authentication.getPrincipal();
		if (user.getRole().equalsIgnoreCase("COORDINATOR")) {

			allGroups = allGroups.stream().filter(g -> courseSecurityService.canAccessCourse(g.getCourseId(), email))
					.toList();
		}

		log.info("Returning {} groups for user {}", allGroups.size(), email);

		return new ResponseEntity<>(allGroups, HttpStatus.OK);
	}

	// Group by ID-------------------

	@GetMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessGroup(#id, authentication.name)")
	public ResponseEntity<GroupRespDto> getCourseGroupById(@PathVariable Integer id) {

		GroupRespDto group = groupService.getCourseGroupById(id);

		return new ResponseEntity<>(group, HttpStatus.OK);
	}

	// ------------------- Update Group

	@PutMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessCourse(#dto.courseId, authentication.name)")
	public ResponseEntity<GroupRespDto> updateCourseGroup(@RequestBody GroupReqDto dto, @PathVariable Integer id) {

		log.info("Updating Group: {} for Course: {}", dto.getGroupName(), dto.getCourseId());

		GroupRespDto updatedGroup = groupService.updateCourseGroup(dto, id);

		return new ResponseEntity<>(updatedGroup, HttpStatus.OK);
	}
	// Delete Group -------------------

	@DeleteMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessGroup(#id, authentication.name)")
	public ResponseEntity<ApiResponse> deleteCourseGroup(@PathVariable Integer id) {

		groupService.deleteCourseGroup(id);

		ApiResponse apiResponse = ApiResponse.builder().message("Course Group Deleted Successfully with id: " + id)
				.status(HttpStatus.OK).statusCode(200).timestamp(LocalDateTime.now()).build();

		log.info("Deleted Group with id: {}", id);

		return new ResponseEntity<>(apiResponse, HttpStatus.OK);

	}

	@GetMapping("/my-courses")
	@PreAuthorize("hasRole('COORDINATOR')")
	public ResponseEntity<List<CourseRespDto>> getMyCourses(Authentication authentication) {

		String email = authentication.getName();

		List<CourseRespDto> assignedCourses = courseService.getCoursesByCoordinatorEmail(email);

		return new ResponseEntity<>(assignedCourses, HttpStatus.OK);
	}
}