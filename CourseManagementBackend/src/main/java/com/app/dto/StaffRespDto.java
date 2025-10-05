package com.app.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StaffRespDto {

	private int id ;
	
	private String name;
        
	private String mobileNo;
    
	private String email;
   
	private String staffType;
    
	private String roleName;
}
