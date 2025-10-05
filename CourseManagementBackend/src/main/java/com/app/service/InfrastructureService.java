package com.app.service;

import java.util.List;

import com.app.dto.InfrastructureReqDto;
import com.app.dto.InfrastructureRespDto;

public interface InfrastructureService {

	public InfrastructureRespDto createInfrastructure(InfrastructureReqDto infrastructureDto);

	public InfrastructureRespDto updateInfrastructure(InfrastructureReqDto infrastructureDto, Integer id);

	public InfrastructureRespDto getInfrastructureById(Integer id);

	public List<InfrastructureRespDto> getAllInfrastructure();

	public void deleteInfrastructureById(Integer id);

}
