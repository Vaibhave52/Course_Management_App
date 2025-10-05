package com.app.service;

import java.util.List;


import com.app.dto.SectionReqDto;
import com.app.dto.SectionRespDto;

public interface SectionService {

	List<SectionRespDto> getAllSection(int subId);

	SectionRespDto addNewSection(SectionReqDto srd);

	SectionRespDto updateSection(int subId, SectionReqDto srd);

	String deleteSection(int secId);

}
