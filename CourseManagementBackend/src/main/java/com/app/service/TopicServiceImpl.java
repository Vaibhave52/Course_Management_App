package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.SectionDao;
import com.app.dao.TopicDao;
import com.app.dto.TopicReqDto;
import com.app.dto.TopicRespDto;
import com.app.entity.Section;
import com.app.entity.Topic;

@Service
public class TopicServiceImpl implements TopicService {

	@Autowired
	private SectionDao sectionDao;

	@Autowired
	private TopicDao topicDao;

	@Override
	public TopicRespDto addTopic(TopicReqDto topicDto) {

		Section section = sectionDao.findById(topicDto.getSectionId())
				.orElseThrow(() -> new RuntimeException("Section not found by id " + topicDto.getSectionId()));

		Topic topic = new Topic(topicDto.getName(), section);

		Topic save = topicDao.save(topic);

		return convertToTopicRespDto(save);
	}

	private TopicRespDto convertToTopicRespDto(Topic t) {
		TopicRespDto dto = new TopicRespDto(t.getId(), t.getName(), t.getSection().getSectionName());
		return dto;
	}

	@Override
	public TopicRespDto editTopic(TopicReqDto topicDto, int topicId) {

		Topic topic = topicDao.findById(topicId)
				.orElseThrow(() -> new RuntimeException("Topic not found by id " + topicId));

		topic.setName(topicDto.getName());

		if (!topic.getSection().getId().equals(topicDto.getSectionId())) {
			Section section = sectionDao.findById(topicDto.getSectionId())
					.orElseThrow(() -> new RuntimeException("Section not found"));
			topic.setSection(section);
		}

		Topic t = topicDao.save(topic);

		return convertToTopicRespDto(t);
	}

	@Override
	public String deleteTopic(int topicId) {

		Topic topic = topicDao.findById(topicId)
				.orElseThrow(() -> new RuntimeException("Topic not found with id " + topicId));

		topicDao.delete(topic);

		return "Deleted Successfully";
	}

	@Override
	public List<TopicRespDto> getAllTopic(int sectionId) {

		List<Topic> list = topicDao.findAllBySectionId(sectionId);

		return list.stream().map(t -> convertToTopicRespDto(t)).toList();

	}

	@Override
	public TopicRespDto getTopicbyId(int topicId) {

		Topic topic = topicDao.findById(topicId)
				.orElseThrow(() -> new RuntimeException("Topic not found by id " + topicId));

		return convertToTopicRespDto(topic);
	}

}
