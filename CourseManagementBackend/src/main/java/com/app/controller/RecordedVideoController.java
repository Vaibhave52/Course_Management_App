package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.app.dto.RecordedVideoDto;
import com.app.dto.RecordedVideoRespDto;
import com.app.service.CourseSecurityService;
import com.app.service.RecordedVideoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recorded-videos")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RecordedVideoController {

	@Autowired
	private RecordedVideoService recordedVideoService;

	@Autowired
	private CourseSecurityService courseSecurityService;

	@PostMapping
	@PreAuthorize("hasRole('COORDINATOR') and @courseSecurity.canAccessCourseModule(#dto.courseModuleId, authentication.name)")
	public ResponseEntity<RecordedVideoRespDto> addRecordedVideo(@RequestBody RecordedVideoDto dto) {
		return ResponseEntity.ok(recordedVideoService.addRecordedVideo(dto));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('COORDINATOR') and @courseSecurity.canAccessRecordedVideo(#id, authentication.name)")
	public ResponseEntity<RecordedVideoRespDto> updateRecordedVideo(@PathVariable Integer id,
			@RequestBody RecordedVideoDto dto) {
		return ResponseEntity.ok(recordedVideoService.updateRecordedVideo(id, dto));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('COORDINATOR') and @courseSecurity.canAccessRecordedVideo(#id, authentication.name)")
	public ResponseEntity<String> deleteRecordedVideo(@PathVariable Integer id) {
		recordedVideoService.deleteRecordedVideo(id);
		return ResponseEntity.ok("Recorded video deleted successfully");
	}

	@GetMapping("/{id}")
	@PreAuthorize("@courseSecurity.canAccessRecordedVideo(#id, authentication.name)")
	public ResponseEntity<RecordedVideoRespDto> getRecordedVideoById(@PathVariable Integer id) {
		return ResponseEntity.ok(recordedVideoService.getRecordedVideoById(id));
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
	public ResponseEntity<List<RecordedVideoRespDto>> getAllRecordedVideos(Authentication authentication) {

		String email = authentication.getName();
		List<RecordedVideoRespDto> videos = recordedVideoService.getAllRecordedVideos();

		if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_COORDINATOR"))) {
			videos = videos.stream().filter(v -> v.getCourseModuleId() != null) // prevent null ids
					.filter(v -> courseSecurityService.canAccessCourseModule(v.getCourseModuleId(), email)).toList();
		}

		return ResponseEntity.ok(videos);
	}
}
