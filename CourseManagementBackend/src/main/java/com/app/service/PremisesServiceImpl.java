package com.app.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.PremisesDao;
import com.app.dto.PremisesReqDto;
import com.app.dto.PremisesRespDto;
import com.app.entity.Premises;

@Service
@Transactional
public class PremisesServiceImpl implements PremisesService {

	@Autowired
	private PremisesDao premiseRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public PremisesRespDto addPremise(PremisesReqDto addPremise) {

		Premises premise = new Premises();

		premise.setInstituteName(addPremise.getInstituteName());
		premise.setAddress(addPremise.getAddress());
		premise.setDescription(addPremise.getDescription());

		Premises save = premiseRepo.save(premise);

		return modelMapper.map(save, PremisesRespDto.class);
	}

	@Override
	public String deletePremise(int id) {

		Premises premise = premiseRepo.findById(id).orElseThrow(() -> new RuntimeException("premise not found"));

		premiseRepo.delete(premise);

		return "Premises deleted";
	}

	@Override
	public PremisesRespDto editPremise(PremisesReqDto addPremise, int id) {

		Premises premise = premiseRepo.findById(id).orElseThrow(() -> new RuntimeException("premise not found"));

		premise.setInstituteName(addPremise.getInstituteName());
		premise.setAddress(addPremise.getAddress());
		premise.setDescription(addPremise.getDescription());

		Premises save = premiseRepo.save(premise);

		return modelMapper.map(save, PremisesRespDto.class);

	}

	@Override
	public List<PremisesRespDto> getAllPremises() {

		List<Premises> all = premiseRepo.findAll();

		return all.stream().map(p -> modelMapper.map(p, PremisesRespDto.class)).toList();
	}

	@Override
	public PremisesRespDto getPremiseById(int id) {
		// TODO Auto-generated method stub
		Premises pre = premiseRepo.findById(id).orElseThrow(() -> new RuntimeException("premise not found"));

		return modelMapper.map(pre, PremisesRespDto.class);
	}

}