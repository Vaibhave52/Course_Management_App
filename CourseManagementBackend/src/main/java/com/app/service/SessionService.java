package com.app.service;

import java.time.LocalDate;
import java.util.List;

import com.app.dto.SessionReqDto;
import com.app.dto.SessionRespDto;

public interface SessionService {

	// add

	public SessionRespDto createSession(SessionReqDto sessionDto);

	// update

	public SessionRespDto updateSession(SessionReqDto sessionDto, Integer id);

	// getById

	public SessionRespDto getSessionById(Integer id);

	// get All

	public List<SessionRespDto> getAllSession();

	// delete By Id

	public void deleteSessionById(Integer id);

	// filter with courseModule and Active session

	public List<SessionRespDto> getSessionsWithFilters(LocalDate date, Integer moduleId, Boolean active);

}
