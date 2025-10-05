package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicRespDto {

	private int id ;
	
	private String topicName ;
	
	private String sectionName ;
	
}
