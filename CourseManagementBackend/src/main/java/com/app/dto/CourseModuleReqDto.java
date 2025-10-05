package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseModuleReqDto {

	private String title;
    
	private String description;
	    
	private String theoryHours;
	    
	private String practicalHours;
	    
	private int staffId;
	
	private int courseId;

}
