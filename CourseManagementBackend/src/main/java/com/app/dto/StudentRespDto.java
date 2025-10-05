package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentRespDto {

	private int id;

	private int registrationNo;

	private String name;

	private String password;

	private String mobileNo;

	private String email;

	private String courseName;

	private String batchName;

	private String groupName;

}
