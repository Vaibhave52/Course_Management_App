package com.app.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import com.app.dao.BatchCycleDao;
import com.app.dao.CourseDao;
import com.app.dao.CourseModuleDao;
import com.app.dao.GroupDao;
import com.app.dao.RecordedVideoDao;
import com.app.dao.ScheduleDao;
import com.app.dao.SessionsDao;
import com.app.entity.BatchCycle;
import com.app.entity.CourseModule;
import com.app.entity.Schedule;
import com.app.utils.StaffUserDetails;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component("courseSecurity")
public class CourseSecurityService {

	@Autowired
	private CourseDao courseDao;

	@Autowired
	private GroupDao groupDao;

	@Autowired
	private SessionsDao sessionDao;

	@Autowired
	private CourseModuleDao courseModuleDao;

	@Autowired
	private ScheduleDao scheduleDao;

	@Autowired
	private RecordedVideoDao recordedVideoDao;

	@Autowired
	private BatchCycleDao batchCycleDao;

	public boolean canAccessCourse(Integer courseId, String email) {
		return courseDao.existsByIdAndCoordinatorEmail(courseId, email);
	}

	public boolean canAccessGroup(Integer groupId, String email) {
		return groupDao.existsByIdAndCoordinatorEmail(groupId, email);
	}

	public boolean canAccessSession(Integer sessionId, String email) {
		return sessionDao.existsByIdAndCoordinatorEmail(sessionId, email);
	}

	// ✅ Check if coordinator can access a recorded video
	public boolean canAccessRecordedVideo(Integer videoId, String email) {
		if (videoId == null || email == null) {
			log.error("Null videoId or email passed: videoId={}, email={}", videoId, email);
			return false;
		}
		return recordedVideoDao.existsByIdAndCoordinatorEmail(videoId, email);
	}

	// ✅ Coordinator access to a module
	public boolean canAccessCourseModule(Integer moduleId, String email) {
		if (moduleId == null || email == null) {
			log.error("Null moduleId or email passed: moduleId={}, email={}", moduleId, email);
			return false; // Or throw a custom exception
		}

		CourseModule module = courseModuleDao.findById(moduleId).orElse(null);
		if (module == null) {
			log.warn("Module {} not found", moduleId);
			return false;
		}

		boolean canAccess = module.getCourses().stream()
				.anyMatch(c -> c.getCoordinator() != null && email.equals(c.getCoordinator().getEmail()));

		log.info("Access check for module {} and email {} = {}", moduleId, email, canAccess);
		return canAccess;
	}

	// ✅ Access check for module update/delete (using moduleId)
	public boolean canAccessModuleByModuleId(Integer moduleId, String email) {
		return canAccessCourseModule(moduleId, email);
	}

	public boolean canAccessCourseByModuleId(Integer moduleId, String email) {
		CourseModule module = courseModuleDao.findById(moduleId).orElse(null);
		return module != null && module.getCourses().stream()
				.anyMatch(c -> c.getCoordinator() != null && c.getCoordinator().getEmail().equals(email));
	}

	// Check if coordinator can access schedule
	public boolean canAccessSchedule(Integer scheduleId, String email) {
		Schedule schedule = scheduleDao.findById(scheduleId)
				.orElseThrow(() -> new RuntimeException("Schedule not found"));
		return canAccessCourseModule(schedule.getCourseModule().getId(), email);
	}

	// Check if coordinator can access a particular batch cycle
	public boolean canAccessBatchCycle(Integer batchCycleId, String email) {
		return batchCycleDao.existsByIdAndCoordinatorEmail(batchCycleId, email);
	}

	// Get batch cycles for a coordinator
	public List<BatchCycle> getBatchCyclesForCoordinator(String email) {
		return batchCycleDao.findAllByCoordinatorEmail(email);
	}

}
