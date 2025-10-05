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

import com.app.dto.PremisesReqDto;
import com.app.dto.PremisesRespDto;
import com.app.service.PremisesService;

@CrossOrigin("*")
@RestController
@RequestMapping("/premises")
public class PremisesController {

	@Autowired
	PremisesService premiseServ;

	@GetMapping("/getall")
	public ResponseEntity<List<PremisesRespDto>> getAllPremises() {
		List<PremisesRespDto> list = premiseServ.getAllPremises();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/getById/{id}")
	public ResponseEntity<PremisesRespDto> getById(@PathVariable int id) {
		PremisesRespDto pre = premiseServ.getPremiseById(id);
		return ResponseEntity.ok(pre);
	}

	@PostMapping("/add")
	public ResponseEntity<PremisesRespDto> addPremise(@RequestBody PremisesReqDto addPremiseDto) {
		PremisesRespDto pre = premiseServ.addPremise(addPremiseDto);
		return ResponseEntity.ok(pre);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deletePremise(@PathVariable int id) {
		String msg = premiseServ.deletePremise(id);
		return ResponseEntity.ok(msg);
	}

	@PutMapping("/edit/{id}")
	public ResponseEntity<PremisesRespDto> editPremise(@RequestBody PremisesReqDto addPremiseDto,
			@PathVariable int id) {
		PremisesRespDto pre = premiseServ.editPremise(addPremiseDto, id);
		return ResponseEntity.ok(pre);
	}
}