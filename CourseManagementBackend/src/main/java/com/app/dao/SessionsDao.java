package com.app.dao;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.Sessions;

public interface SessionsDao extends JpaRepository<Sessions, Integer> {

	@Query("""
			    SELECT s FROM Sessions s
			    JOIN s.courseModule cm
			    JOIN cm.courses c
			    WHERE (:moduleId IS NULL OR cm.id = :moduleId)
			      AND (:date IS NULL OR s.sessionDate = :date)
			      AND (:email IS NULL OR c.coordinator.email = :email)
			""")
	List<Sessions> findFilteredSessions(LocalDate date, Integer moduleId, String email);

	@Query("""
			    SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END
			    FROM Sessions s
			    JOIN s.courseModule cm
			    JOIN cm.courses c
			    WHERE s.id = :sessionId
			      AND c.coordinator.email = :email
			""")
	boolean existsByIdAndCoordinatorEmail(@Param("sessionId") Integer sessionId, @Param("email") String email);
}
