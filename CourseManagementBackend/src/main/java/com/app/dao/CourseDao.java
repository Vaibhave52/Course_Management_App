package com.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.entity.Course;

@Repository
public interface CourseDao extends JpaRepository<Course, Integer> {

	Optional<Course> findByName(String name);

	List<Course> findAll();

	// Spring Data JPA method to fetch courses by coordinator's email

	@Query("SELECT c FROM Course c JOIN c.coordinator coord WHERE coord.email = :email")
	List<Course> findByCoordinatorEmail(@Param("email") String email);

	@Query("""
			    SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
			    FROM Course c
			    WHERE c.id = :courseId
			      AND c.coordinator.email = :email
			""")
	boolean existsByIdAndCoordinatorEmail(@Param("courseId") Integer courseId, @Param("email") String email);

	@Query("SELECT c FROM Course c WHERE c.coordinator.email = :email")
	List<Course> findAllByCoordinatorEmail(@Param("email") String email);

	@Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Course c WHERE c.coordinator.id = :coordinatorId")
	boolean existsByCoordinatorId(@Param("coordinatorId") int coordinatorId);

}
