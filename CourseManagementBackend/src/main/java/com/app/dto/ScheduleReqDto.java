package com.app.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScheduleReqDto {
	
	private LocalDate date;
	
	private LocalTime startTime;
	
	private LocalTime endTime;
	
	private int courseModuleId;
	
	private List<Integer> infrastructureId;
	
	private List<Integer> groupIds;
	
	private List<Integer> staffId ;
	
	private String comment;

}
