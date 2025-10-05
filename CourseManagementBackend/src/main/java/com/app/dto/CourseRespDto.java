package com.app.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseRespDto {

	private int id;

	private String name;

	private String description;

	private LocalDate startDate;

	private LocalDate endDate;

	private String batchCycleTitle;

	private String CourseTypeName;

	private List<String> premisesName;

	private String status;

	private String staffName;

	private int studentCount;

	private List<String> modules;

	private Integer coordinatorId;

	private String coordinatorName; // Optional

}
