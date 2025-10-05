package com.app.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.CourseModuleDao;
import com.app.dao.SessionsDao;
import com.app.dto.SessionReqDto;
import com.app.dto.SessionRespDto;
import com.app.entity.CourseModule;
import com.app.entity.Sessions;
import com.app.exceptions.ResourseNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SessionServiceImpl implements SessionService {

	@Autowired
	private CourseModuleDao courseModuleDao;

	@Autowired
	private SessionsDao sessionRepository;

	@Override
	public SessionRespDto createSession(SessionReqDto sessionDto) {

		Sessions session = convertToEntity(sessionDto);

		Sessions savedSession = sessionRepository.save(session);

		log.info(" in service layer  session Dto  title is  {}", savedSession.getTitle());

		return convertToDto(savedSession);

	}

	private Sessions convertToEntity(SessionReqDto dto) {

		Sessions session = new Sessions();

		session.setTitle(dto.getTitle());
		session.setCodeShareToken(dto.getCodeShareToken());
		session.setSessionDate(dto.getSessionDate());
		session.setStartTime(dto.getStartTime());
		session.setEndTime(dto.getEndTime());
		session.setZoomMeetingId(dto.getZoomMeetingId());
		session.setZoomMeetingPassword(dto.getZoomMeetingPassword());
		session.setDescription(dto.getDescription());

		CourseModule courseM = courseModuleDao.findById(dto.getCourseModuleId())
				.orElseThrow(() -> new ResourseNotFoundException(
						"CourseModule is not found with given id: " + dto.getCourseModuleId()));

		session.setCourseModule(courseM);

		return session;
	}

	private SessionRespDto convertToDto(Sessions session) {

		LocalDate today = LocalDate.now();
		boolean isActive = !session.getSessionDate().isBefore(today); // session active if today or future

		SessionRespDto dto = new SessionRespDto();
		dto.setId(session.getId());
		dto.setTitle(session.getTitle());
		dto.setCodeShareToken(session.getCodeShareToken());
		dto.setSessionDate(session.getSessionDate());
		dto.setStartTime(session.getStartTime());
		dto.setEndTime(session.getEndTime());
		dto.setZoomMeetingId(session.getZoomMeetingId());
		dto.setZoomMeetingPassword(session.getZoomMeetingPassword());
		dto.setDescription(session.getDescription());
		dto.setActive(isActive);

		if (session.getCourseModule() != null) {
			dto.setCourseModuleName(session.getCourseModule().getTitle());
			dto.setCourseModuleId(session.getCourseModule().getId()); // ✅ set moduleId for security filter
		}

		return dto;
	}

	@Override
	public SessionRespDto updateSession(SessionReqDto sessionDto, Integer id) {

		CourseModule courseM = courseModuleDao.findById(sessionDto.getCourseModuleId())
				.orElseThrow(() -> new ResourseNotFoundException(
						"CourseModule is not found with given id: " + sessionDto.getCourseModuleId()));

		Sessions session = sessionRepository.findById(id)
				.orElseThrow(() -> new ResourseNotFoundException("Session is not found with given id: " + id));

		session.setTitle(sessionDto.getTitle());
		session.setCodeShareToken(sessionDto.getCodeShareToken());
		session.setSessionDate(sessionDto.getSessionDate());
		session.setStartTime(sessionDto.getStartTime());
		session.setEndTime(sessionDto.getEndTime());
		session.setZoomMeetingId(sessionDto.getZoomMeetingId());
		session.setZoomMeetingPassword(sessionDto.getZoomMeetingPassword());
		session.setDescription(sessionDto.getDescription());
		session.setCourseModule(courseM);

		Sessions savedRepository = sessionRepository.save(session);

		return convertToDto(savedRepository);
	}

	@Override
	public SessionRespDto getSessionById(Integer id) {

		Sessions session = sessionRepository.findById(id)
				.orElseThrow(() -> new ResourseNotFoundException("Session is not found with given id: " + id));

		return convertToDto(session);
	}

	@Override
	public List<SessionRespDto> getAllSession() {

		List<Sessions> sessions = sessionRepository.findAll();

		List<SessionRespDto> sessionsAllDto = sessions.stream().map(all -> {

			return convertToDto(all);

		}).collect(Collectors.toList());

		return sessionsAllDto;
	}

	@Override
	public void deleteSessionById(Integer id) {
		Sessions session = sessionRepository.findById(id)
				.orElseThrow(() -> new ResourseNotFoundException("Session is not found with given id: " + id));

		sessionRepository.delete(session);
	}

	@Override
	public List<SessionRespDto> getSessionsWithFilters(LocalDate date, Integer moduleId, Boolean active) {
		List<Sessions> sessions = sessionRepository.findAll();

		return sessions.stream().filter(s -> (date == null || s.getSessionDate().equals(date)))
				.filter(s -> (moduleId == null || s.getCourseModule().getId().equals(moduleId))).filter(s -> {
					if (active == null)
						return true;
					boolean isActive = !s.getSessionDate().isBefore(LocalDate.now());
					return active == isActive;
				}).map(this::convertToDto).collect(Collectors.toList());
	}

}
