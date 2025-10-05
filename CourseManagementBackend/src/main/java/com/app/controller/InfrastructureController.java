package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.InfrastructureReqDto;
import com.app.dto.InfrastructureRespDto;
import com.app.responsemessage.ApiResponse;
import com.app.service.InfrastructureService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/infrastructure")
@Slf4j
@CrossOrigin("*")
public class InfrastructureController {

	@Autowired
	private InfrastructureService infrastructureService;

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<InfrastructureRespDto> addInfrastructure(
			@RequestBody InfrastructureReqDto infrastructureDto) {

		return new ResponseEntity<InfrastructureRespDto>(infrastructureService.createInfrastructure(infrastructureDto),

				HttpStatus.CREATED);

	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN') or hasRole('COORDINATOR')")
	public ResponseEntity<List<InfrastructureRespDto>> getAllInfrastructure() {

		return new ResponseEntity<List<InfrastructureRespDto>>(infrastructureService.getAllInfrastructure(),
				HttpStatus.OK);

	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<InfrastructureRespDto> updateInfrastructure(
			@RequestBody InfrastructureReqDto infrastructureDto, @PathVariable Integer id) {

		log.info(" update  Controller layer having {} {} ", infrastructureDto, id);

		return new ResponseEntity<InfrastructureRespDto>(
				infrastructureService.updateInfrastructure(infrastructureDto, id),

				HttpStatus.OK);

	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<InfrastructureRespDto> getInfrastructureById(@PathVariable Integer id) {

		log.info(" get  Controller layer having {} ", id);

		return new ResponseEntity<InfrastructureRespDto>(infrastructureService.getInfrastructureById(id),
				HttpStatus.OK);

	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse> deleteInfrastructureById(@PathVariable Integer id) {

		infrastructureService.deleteInfrastructureById(id);

		ApiResponse apiResponse = ApiResponse.builder().message("Infrastructure deleted with id " + id)
				.status(HttpStatus.OK).build();

		return new ResponseEntity<ApiResponse>(apiResponse, HttpStatus.OK);

	}

}
