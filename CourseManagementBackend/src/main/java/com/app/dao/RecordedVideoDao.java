package com.app.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.RecordedVideo;

public interface RecordedVideoDao extends JpaRepository<RecordedVideo, Integer> {

	@Query("""
			    SELECT CASE WHEN COUNT(rv) > 0 THEN true ELSE false END
			    FROM RecordedVideo rv
			    JOIN rv.courseModule m
			    JOIN m.courses c
			    WHERE rv.id = :videoId
			      AND c.coordinator.email = :email
			""")
	boolean existsByIdAndCoordinatorEmail(@Param("videoId") Integer videoId, @Param("email") String email);
}
