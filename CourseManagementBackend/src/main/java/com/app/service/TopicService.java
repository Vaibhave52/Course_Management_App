package com.app.service;

import java.util.List;

import com.app.dto.TopicReqDto;
import com.app.dto.TopicRespDto;

public interface TopicService {

	TopicRespDto addTopic(TopicReqDto topicDto);

	TopicRespDto editTopic(TopicReqDto topicDto, int topicId);

	String deleteTopic(int topicId);

	List<TopicRespDto> getAllTopic(int sectionId);

	TopicRespDto getTopicbyId(int topicId);

}
