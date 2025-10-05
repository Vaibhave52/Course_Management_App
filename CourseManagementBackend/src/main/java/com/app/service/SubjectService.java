package com.app.service;

import java.util.List;

import com.app.dto.SubjectReqDto;
import com.app.dto.SubjectRespDto;

public interface SubjectService {
	
	public List<SubjectRespDto> getAllSubjects();
	
	public SubjectRespDto addSubject(SubjectReqDto dto);
	
	public SubjectRespDto updateSubject(int id,SubjectReqDto dto);
	
	public void deleteSubject(int id);
	
	public SubjectRespDto getSubjectById(int id);

}
