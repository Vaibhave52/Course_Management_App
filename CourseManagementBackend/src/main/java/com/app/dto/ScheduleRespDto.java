package com.app.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
public class ScheduleRespDto {

	private int id;

	private LocalDate date;

	private LocalTime startTime;

	private LocalTime endTime;

	private Integer courseModuleId;

	private String moduleName;

	private List<String> infrastructureName;

	private List<String> groupName;

	private List<String> staffName;

	private String comment;

}
