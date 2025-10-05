package com.app.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.InfrastuctureDao;
import com.app.dao.PremisesDao;
import com.app.dto.InfrastructureReqDto;
import com.app.dto.InfrastructureRespDto;
import com.app.entity.Infrastructure;
import com.app.entity.Premises;
import com.app.entity.enums.InfrastructureType;
import com.app.exceptions.ResourseNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class InfrastructureServiceImpl implements InfrastructureService {

	@Autowired
	private InfrastuctureDao infrastuctureRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PremisesDao premisesRepository;

	@Override
	public InfrastructureRespDto createInfrastructure(InfrastructureReqDto infrastructureDto) {

		log.info("In service Layer {}", infrastructureDto);

		Premises premises = premisesRepository.findById(infrastructureDto.getPremisesId())
				.orElseThrow(() -> new ResourseNotFoundException(

						"Premises is Not found with given id : " + infrastructureDto.getPremisesId()));
		
		Infrastructure infrastructure = modelMapper.map(infrastructureDto, Infrastructure.class);

		infrastructure.setPremises(premises);

		infrastructure.setId(null);
		
		Infrastructure savedInfrastructure = infrastuctureRepository.save(infrastructure);

		log.info("In service Layer {}", infrastructure);

		 InfrastructureRespDto map = modelMapper.map(savedInfrastructure, InfrastructureRespDto.class);
		 
		 map.setPremisesName(savedInfrastructure.getPremises().getInstituteName());
		 		 
		 return map ;
	}

	@Override
	public InfrastructureRespDto updateInfrastructure(InfrastructureReqDto infrastructureDto, Integer id) {

		Infrastructure infrastructure = infrastuctureRepository.findById(id)

				.orElseThrow(() -> new ResourseNotFoundException("Infrastructure  is not found with given id: " + id));

		Premises premises = premisesRepository.findById(infrastructureDto.getPremisesId())

				.orElseThrow(() -> new ResourseNotFoundException(

						"Premises is not found with given id: " + infrastructureDto.getPremisesId()));

		infrastructure.setDescription(infrastructureDto.getDescription());
		infrastructure.setInfrastructureType(InfrastructureType.valueOf(infrastructureDto.getInfrastructureType()));
		infrastructure.setTitle(infrastructureDto.getTitle());
		infrastructure.setPremises(premises);

		Infrastructure savedInfrastructure = infrastuctureRepository.save(infrastructure);

		 InfrastructureRespDto map = modelMapper.map(savedInfrastructure, InfrastructureRespDto.class);
		 
		 map.setPremisesName(savedInfrastructure.getPremises().getInstituteName());
		 
		 return map ;

	}

	@Override
	public InfrastructureRespDto getInfrastructureById(Integer id) {

		Infrastructure infrastructure = infrastuctureRepository.findById(id)

				.orElseThrow(() -> new ResourseNotFoundException("Infrastructure  is not found with given id: " + id));

		log.info(" get  service layer having infrastructure {} with id {} ", infrastructure, id);

		 InfrastructureRespDto map = modelMapper.map(infrastructure, InfrastructureRespDto.class);
		 
		 map.setPremisesName(infrastructure.getPremises().getInstituteName());
		 
		 return map ;
	}

	@Override
	public List<InfrastructureRespDto> getAllInfrastructure() {

		List<Infrastructure> listInfra = infrastuctureRepository.findAll();

		log.info("get All Infrastructure service layer {}", listInfra);

		List<InfrastructureRespDto> collect = listInfra.stream()
				.map(list -> {
					InfrastructureRespDto dto = modelMapper.map(list, InfrastructureRespDto.class);
					dto.setPremisesName(list.getPremises().getInstituteName());
					return dto ;
					})
				.collect(Collectors.toList());

		return collect ;
		
	}

	@Override
	public void deleteInfrastructureById(Integer id) {

		Infrastructure infrastructure = infrastuctureRepository.findById(id)

				.orElseThrow(() -> new ResourseNotFoundException("Infrastructure  is not found with given id: " + id));

		infrastuctureRepository.delete(infrastructure);

	}

}
