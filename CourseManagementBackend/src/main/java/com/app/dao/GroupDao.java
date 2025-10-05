package com.app.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.entity.Group;

@Repository
public interface GroupDao extends JpaRepository<Group, Integer> {

	// Get groups for a coordinator's courses
	@Query("SELECT g FROM Group g JOIN g.course c JOIN c.staff s WHERE s.id = :staffId")
	List<Group> findGroupsByCoordinatorId(Integer staffId);

	@Query("""
			    SELECT CASE WHEN COUNT(g) > 0 THEN true ELSE false END
			    FROM Group g
			    WHERE g.id = :groupId
			      AND g.course.coordinator.email = :email
			""")
	boolean existsByIdAndCoordinatorEmail(@Param("groupId") Integer groupId, @Param("email") String email);
}
