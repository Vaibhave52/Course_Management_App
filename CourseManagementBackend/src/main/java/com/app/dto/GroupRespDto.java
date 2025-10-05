package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GroupRespDto {

	private int id;

	private String groupName;

	private String description;

	private int courseId;

	private String courseName;

}
