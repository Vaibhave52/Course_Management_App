package com.app.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.CourseModuleDao;
import com.app.dao.RecordedVideoDao;
import com.app.dto.RecordedVideoDto;
import com.app.dto.RecordedVideoRespDto;
import com.app.entity.CourseModule;
import com.app.entity.RecordedVideo;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RecordedVideoServiceImpl implements RecordedVideoService {

	@Autowired
	private RecordedVideoDao recordedVideoRepo;

	@Autowired
	private CourseModuleDao courseModuleRepo;

	@Override
	public RecordedVideoRespDto addRecordedVideo(RecordedVideoDto dto) {
		// Fetch CourseModule
		CourseModule module = courseModuleRepo.findById(dto.getCourseModuleId())
				.orElseThrow(() -> new RuntimeException("CourseModule not found"));

		// Create entity
		RecordedVideo video = new RecordedVideo();
		video.setVideoTitle(dto.getVideoTitle());
		video.setVideoUrl(dto.getVideoUrl());
		video.setDate(dto.getDate());
		video.setCourseModule(module);

		recordedVideoRepo.save(video);

		// Return Resp DTO
		return mapToRespDto(video);
	}

	@Override
	public RecordedVideoRespDto updateRecordedVideo(Integer id, RecordedVideoDto dto) {
		// Fetch existing video
		RecordedVideo video = recordedVideoRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("RecordedVideo not found"));

		// Fetch related CourseModule
		CourseModule module = courseModuleRepo.findById(dto.getCourseModuleId())
				.orElseThrow(() -> new RuntimeException("CourseModule not found"));

		// Update fields directly
		video.setVideoTitle(dto.getVideoTitle());
		video.setVideoUrl(dto.getVideoUrl());
		video.setDate(dto.getDate());
		video.setCourseModule(module);

		recordedVideoRepo.save(video);

		// Return Resp DTO
		return mapToRespDto(video);
	}

	@Override
	public void deleteRecordedVideo(Integer id) {
		if (!recordedVideoRepo.existsById(id)) {
			throw new RuntimeException("RecordedVideo not found");
		}
		recordedVideoRepo.deleteById(id);
	}

	@Override
	public List<RecordedVideoRespDto> getAllRecordedVideos() {
		return recordedVideoRepo.findAll().stream().map(this::mapToRespDto).collect(Collectors.toList());
	}

	private RecordedVideoRespDto mapToRespDto(RecordedVideo video) {
		RecordedVideoRespDto dto = new RecordedVideoRespDto();
		dto.setId(video.getId()); // include ID
		dto.setVideoTitle(video.getVideoTitle());
		dto.setVideoUrl(video.getVideoUrl());
		dto.setDate(video.getDate());
		dto.setCourseModuleId(video.getCourseModule().getId());
		dto.setCourseName(video.getCourseModule().getTitle());
		dto.setCourseModuleTitle(video.getCourseModule().getTitle());

		return dto;
	}

	@Override
	public RecordedVideoRespDto getRecordedVideoById(Integer id) {
		// Fetch the RecordedVideo entity by ID
		RecordedVideo video = recordedVideoRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("RecordedVideo not found with id: " + id));

		// Map the entity to RecordedVideoRespDto
		RecordedVideoRespDto respDto = new RecordedVideoRespDto();
		respDto.setId(video.getId());
		respDto.setVideoTitle(video.getVideoTitle());
		respDto.setVideoUrl(video.getVideoUrl());
		respDto.setDate(video.getDate());
		respDto.setCourseModuleId(video.getCourseModule().getId()); // assuming courseModule is not null

		return respDto;
	}
}
