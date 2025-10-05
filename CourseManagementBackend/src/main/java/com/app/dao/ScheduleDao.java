package com.app.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.app.entity.Schedule;

@Repository
public interface ScheduleDao extends JpaRepository<Schedule, Integer> {

	@Query("SELECT s FROM Schedule s WHERE s.date BETWEEN :start AND :end")
	List<Schedule> getScheduleReport(@Param("start") LocalDate start, @Param("end") LocalDate end);

	// Fetch all schedules for a particular course module
	List<Schedule> findByCourseModuleId(Integer moduleId);
}
