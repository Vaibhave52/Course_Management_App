package com.app.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffReqDto {

	private String name;
	
	private String password;
	
	private String mobileNo;
	
	private String email;
	
	private String staffType;
	
	private int roleID;
}
