package com.app.service;

import java.util.List;

import com.app.dto.BatchCycleReqDto;
import com.app.dto.BatchCycleRespDto;

public interface BatchCycleService {

	BatchCycleRespDto addBatchCycle(BatchCycleReqDto bcd);

	String deleteBatchCycle(int id);

	BatchCycleRespDto editBatchCycle(int id, BatchCycleReqDto addBatchCycleDto);

	List<BatchCycleRespDto> getAllBatchCycle();
	
	List<BatchCycleRespDto> getBatchCyclesForCoordinator(String coordinatorEmail);

}
