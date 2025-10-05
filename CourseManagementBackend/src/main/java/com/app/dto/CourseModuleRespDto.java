package com.app.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseModuleRespDto {

	private int id;

	private String title;

	private String description;

	private String theoryHours;

	private String practicalHours;

	private String staffName;

	private List<Integer> courseIds;

	private List<String> courseNames;
}
