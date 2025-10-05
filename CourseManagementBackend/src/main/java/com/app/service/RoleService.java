package com.app.service;

import java.util.List;

import com.app.dto.RoleReqDto;
import com.app.dto.RoleRespDto;

public interface RoleService {

	RoleRespDto addRole(RoleReqDto role );
	
	RoleRespDto updateRole(RoleReqDto role , int id);
	
	RoleRespDto getRoleById(int id);
	
	List<RoleRespDto> getAllRole();
	
	String deleteRole(int id);

}
