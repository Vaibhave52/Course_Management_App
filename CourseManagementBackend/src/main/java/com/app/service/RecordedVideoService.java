package com.app.service;

import java.util.List;
import com.app.dto.RecordedVideoDto;
import com.app.dto.RecordedVideoRespDto;

public interface RecordedVideoService {

	RecordedVideoRespDto addRecordedVideo(RecordedVideoDto dto);

	RecordedVideoRespDto updateRecordedVideo(Integer id, RecordedVideoDto dto);

	void deleteRecordedVideo(Integer id);

	RecordedVideoRespDto getRecordedVideoById(Integer id);

	List<RecordedVideoRespDto> getAllRecordedVideos();
}
