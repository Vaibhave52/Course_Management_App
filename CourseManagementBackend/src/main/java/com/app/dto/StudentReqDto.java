package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentReqDto {

	private int registrationNo;
    
	private String name;
    
	private String password;
    
	private String mobileNo;
    
	private String email;

    private int courseId;
    
    private int batchId;
    
    private int groupId;
}
