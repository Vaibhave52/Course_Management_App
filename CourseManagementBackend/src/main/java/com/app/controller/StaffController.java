package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.StaffReqDto;
import com.app.dto.StaffRespDto;
import com.app.service.StaffService;

@CrossOrigin("*")
@RestController
@RequestMapping("/staff")
public class StaffController {

	@Autowired
	private StaffService staffServ;

	@PostMapping("/add")
	public ResponseEntity<StaffRespDto> addStaff(@RequestBody StaffReqDto staffDto) {
		StaffRespDto staff = staffServ.addStaff(staffDto);
		return ResponseEntity.ok(staff);
	}

	@PutMapping("/update/{staffId}")
	public ResponseEntity<StaffRespDto> updateStaff(@RequestBody StaffReqDto staffDto, @PathVariable int staffId) {
		StaffRespDto staff = staffServ.updateStaff(staffDto, staffId);
		return ResponseEntity.ok(staff);
	}

	@DeleteMapping("/{staffId}")
	public ResponseEntity<String> deleteStaff(@PathVariable int staffId) {
		String msg = staffServ.deleteStaff(staffId);
		return ResponseEntity.ok(msg);
	}

	@GetMapping("/getall")
	public ResponseEntity<List<StaffRespDto>> getAllStaff() {
		List<StaffRespDto> list = staffServ.getAll();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{staffId}")
	public ResponseEntity<StaffRespDto> getStaff(@PathVariable int staffId) {
		StaffRespDto staff = staffServ.getStaff(staffId);
		return ResponseEntity.ok(staff);
	}
	
	@GetMapping("/email/{email}")
	public ResponseEntity<StaffRespDto> getStaffByEmail(@PathVariable String email) {
	    StaffRespDto staff = staffServ.getStaffByEmail(email);
	    return ResponseEntity.ok(staff);
	}

}
