package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.TopicReqDto;
import com.app.dto.TopicRespDto;
import com.app.service.TopicService;

@CrossOrigin("*")
@RestController
@RequestMapping("/topic")
public class TopicController {

	@Autowired
	private TopicService topicService;

	@PostMapping("/add")
	public ResponseEntity<TopicRespDto> addNewTopic(@RequestBody TopicReqDto topicDto) {
		TopicRespDto topic = topicService.addTopic(topicDto);
		return ResponseEntity.ok(topic);
	}

	@DeleteMapping("/delete/{topicId}")
	public ResponseEntity<String> deleteTopic(@PathVariable("topicId") int id) {
		topicService.deleteTopic(id);
		return ResponseEntity.ok("Topic Deleted");

	}

	@GetMapping("/getById/{topicId}")
	public ResponseEntity<TopicRespDto> getTopicById(@PathVariable("topicId") int id) {
		TopicRespDto topic = topicService.getTopicbyId(id);
		return ResponseEntity.ok(topic);
	}

	@GetMapping("/getall/{sectionId}")
	public ResponseEntity<List<TopicRespDto>> getAllTopics(@PathVariable("sectionId") int id) {
		List<TopicRespDto> list = topicService.getAllTopic(id);
		return ResponseEntity.ok(list);

	}

	@PutMapping("/edit/{topicId}")
	public ResponseEntity<TopicRespDto> editTopic(@RequestBody TopicReqDto topicDto, @PathVariable("topicId") int id) {
		TopicRespDto topic = topicService.editTopic(topicDto, id);
		return ResponseEntity.ok(topic);

	}
}
