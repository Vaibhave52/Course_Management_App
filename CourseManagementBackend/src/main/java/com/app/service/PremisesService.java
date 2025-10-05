package com.app.service;

import java.util.List;

import com.app.dto.PremisesReqDto;
import com.app.dto.PremisesRespDto;

public interface PremisesService {
	
	List<PremisesRespDto> getAllPremises();

	PremisesRespDto addPremise(PremisesReqDto addPremise);

	String deletePremise(int id);
	
	PremisesRespDto editPremise(PremisesReqDto addPremise , int id);
	
	PremisesRespDto getPremiseById(int id);
	
	

}