package com.app.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.SessionReqDto;
import com.app.dto.SessionRespDto;
import com.app.responsemessage.ApiResponse;
import com.app.service.CourseSecurityService;
import com.app.service.SessionService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/session")
@Slf4j
@CrossOrigin("*")
public class SessionController {

	@Autowired
	private SessionService sessionService;

	@Autowired
	private CourseSecurityService courseSecurityService;

	// ------------------- Create Session -------------------

	@PostMapping
	@PreAuthorize("@courseSecurity.canAccessCourseModule(#sessionDto.courseModuleId, authentication.name)")
	public ResponseEntity<SessionRespDto> createSession(@RequestBody SessionReqDto sessionDto) {

		log.info("Creating session for courseModuleId {} by {}", sessionDto.getCourseModuleId(),
				SecurityContextHolder.getContext().getAuthentication().getName());

		return new ResponseEntity<>(sessionService.createSession(sessionDto), HttpStatus.CREATED);
	}

	// ------------------- Update Session -------------------

	@PutMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessCourseModule(#sessionDto.courseModuleId, authentication.name)")
	public ResponseEntity<SessionRespDto> updateSession(@RequestBody SessionReqDto sessionDto,
			@PathVariable Integer id) {

		return ResponseEntity.ok(sessionService.updateSession(sessionDto, id));
	}

	// ------------------- Get All Sessions -------------------

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
	public ResponseEntity<List<SessionRespDto>> getAllSession(Authentication authentication) {

		log.info("User: {}, Authorities: {}", authentication.getName(), authentication.getAuthorities());

		String email = authentication.getName();
		List<SessionRespDto> allSessions = sessionService.getAllSession();

		// Filter sessions for coordinator only

		if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COORDINATOR"))) {
			allSessions = allSessions.stream().filter(s -> courseSecurityService.canAccessSession(s.getId(), email))
					.toList();
		}

		return ResponseEntity.ok(allSessions);
	}

	// ------------------- Get Session by ID -------------------

	@GetMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessSession(#id, authentication.name)")
	public ResponseEntity<SessionRespDto> getSessionById(@PathVariable Integer id) {
		return ResponseEntity.ok(sessionService.getSessionById(id));
	}

	// ------------------- Delete Session -------------------

	@DeleteMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessSession(#id, authentication.name)")
	public ResponseEntity<ApiResponse> deleteSessionById(@PathVariable Integer id) {
		sessionService.deleteSessionById(id);
		ApiResponse apiResponse = ApiResponse.builder().message("Session deleted by id: " + id).status(HttpStatus.OK)
				.statusCode(200).timestamp(LocalDateTime.now()).build();
		return ResponseEntity.ok(apiResponse);
	}

	// ------------------- Filter Sessions -------------------

	@GetMapping("/filter")
	@PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
	public ResponseEntity<List<SessionRespDto>> getSessionsWithFilters(@RequestParam(required = false) LocalDate date,
			@RequestParam(required = false) Integer moduleId, @RequestParam(required = false) Boolean active,
			Authentication authentication) {

		String email = authentication.getName();

		// Get all filtered sessions from service
		List<SessionRespDto> allFiltered = sessionService.getSessionsWithFilters(date, moduleId, active);

		// If user is coordinator, filter sessions by assigned modules
		if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COORDINATOR"))) {

			allFiltered = allFiltered.stream().filter(s -> s.getCourseModuleId() != null) // ensure moduleId is present
					.filter(s -> courseSecurityService.canAccessCourseModule(s.getCourseModuleId(), email)).toList();
		}

		log.info("Filtered sessions for user {} — date: {}, moduleId: {}, active: {}. Result count: {}", email, date,
				moduleId, active, allFiltered.size());

		return ResponseEntity.ok(allFiltered);
	}

}
