package com.app.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.BatchCycleDao;
import com.app.dto.BatchCycleReqDto;
import com.app.dto.BatchCycleRespDto;
import com.app.entity.BatchCycle;

@Service
@Transactional
public class BatchCycleServiceImpl implements BatchCycleService {

	@Autowired
	private BatchCycleDao batchRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public String deleteBatchCycle(int id) {

		BatchCycle batch = batchRepo.findById(id).orElseThrow(() -> new RuntimeException("Batch not found"));

		batchRepo.delete(batch);

		return "deleted successfully";
	}

	@Override
	public BatchCycleRespDto editBatchCycle(int id, BatchCycleReqDto addBatchCycleDto) {

		BatchCycle batch = batchRepo.findById(id).orElseThrow(() -> new RuntimeException("Batch not found"));

		batch.setName(addBatchCycleDto.getName());
		batch.setDescription(addBatchCycleDto.getDescription());
		batch.setStartDate(addBatchCycleDto.getStartDate());
		batch.setEndDate(addBatchCycleDto.getEndDate());
		batch.setIsActive(addBatchCycleDto.getIsActive());

		BatchCycle dbBatch = batchRepo.save(batch);

		BatchCycleRespDto respDto = modelMapper.map(dbBatch, BatchCycleRespDto.class);

		return respDto;
	}

	@Override
	public BatchCycleRespDto addBatchCycle(BatchCycleReqDto bcd) {

		BatchCycle batchCycle = modelMapper.map(bcd, BatchCycle.class);

		BatchCycle savedEntity = batchRepo.save(batchCycle);

		BatchCycleRespDto respDto = modelMapper.map(savedEntity, BatchCycleRespDto.class);

		return respDto;
	}

	@Override
	public List<BatchCycleRespDto> getAllBatchCycle() {

		List<BatchCycle> list = batchRepo.findAll();

		List<BatchCycleRespDto> respDto = list.stream().map(batch -> modelMapper.map(batch, BatchCycleRespDto.class))
				.toList();

		return respDto;
	}

	@Override
	public List<BatchCycleRespDto> getBatchCyclesForCoordinator(String coordinatorEmail) {

		// Fetch only batch cycles linked to courses coordinated by this coordinator

		List<BatchCycle> list = batchRepo.findAllByCoursesCoordinatorEmail(coordinatorEmail);

		return list.stream().map(batch -> modelMapper.map(batch, BatchCycleRespDto.class)).toList();
	}
}
