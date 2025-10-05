package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.dto.RoleReqDto;
import com.app.dto.RoleRespDto;
import com.app.service.RoleService;

@CrossOrigin("*")
@RestController
@RequestMapping("/roles")
public class RoleController {

	@Autowired
	private RoleService roleService;

	@PostMapping("/add")
	public ResponseEntity<RoleRespDto> addRole(@RequestBody RoleReqDto roleDto) {
		RoleRespDto savedRole = roleService.addRole(roleDto);
		return ResponseEntity.ok(savedRole);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<RoleRespDto> updateRole(@PathVariable int id, @RequestBody RoleReqDto roleDto) {
		RoleRespDto updatedRole = roleService.updateRole(roleDto, id);
		return ResponseEntity.ok(updatedRole);
	}

	@GetMapping("/getbyid/{id}")
	public ResponseEntity<RoleRespDto> getRoleById(@PathVariable int id) {
		RoleRespDto role = roleService.getRoleById(id);
		return ResponseEntity.ok(role);
	}

	@GetMapping("/getall")
	public ResponseEntity<List<RoleRespDto>> getAllRoles() {
		List<RoleRespDto> roles = roleService.getAllRole();
		return ResponseEntity.ok(roles);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteRole(@PathVariable int id) {
		String msg = roleService.deleteRole(id);
		return ResponseEntity.ok(msg);
	}
}
