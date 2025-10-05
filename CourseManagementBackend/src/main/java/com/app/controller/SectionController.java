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

import com.app.dto.SectionReqDto;
import com.app.dto.SectionRespDto;
import com.app.service.SectionService;

@CrossOrigin("*")
@RestController
@RequestMapping("/section")
public class SectionController {

	@Autowired
	private SectionService sectionServ;

	@GetMapping("/{subId}")
	public ResponseEntity<List<SectionRespDto>> getAllSections(@PathVariable int subId) {
		List<SectionRespDto> list = sectionServ.getAllSection(subId);
		return ResponseEntity.ok(list);
	}

	@PostMapping("/add")
	public ResponseEntity<SectionRespDto> addNewSection(@RequestBody SectionReqDto srd) {
		SectionRespDto sec = sectionServ.addNewSection(srd);
		;
		return ResponseEntity.ok(sec);
	}

	@PutMapping("/update/{secId}")
	public ResponseEntity<SectionRespDto> updateSection(@PathVariable int secId, @RequestBody SectionReqDto srd) {
		SectionRespDto sec = sectionServ.updateSection(secId, srd);
		return ResponseEntity.ok(sec);
	}

	@DeleteMapping("/{secId}")
	public ResponseEntity<String> deleteSection(@PathVariable int secId) {
		String msg = sectionServ.deleteSection(secId);

		return ResponseEntity.ok(msg);
	}
}
