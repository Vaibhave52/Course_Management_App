package com.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.entity.BatchCycle;

public interface BatchCycleDao extends JpaRepository<BatchCycle, Integer> {

	Optional<BatchCycle> findById(int batchCycleId);

	@Query("""
			SELECT bc FROM BatchCycle bc
			JOIN bc.courses c
			WHERE c.coordinator.email = :email
			""")
	List<BatchCycle> findAllByCoordinatorEmail(@Param("email") String email);

	@Query("""
			SELECT CASE WHEN COUNT(bc) > 0 THEN true ELSE false END
			FROM BatchCycle bc
			JOIN bc.courses c
			WHERE bc.id = :batchCycleId
			  AND c.coordinator.email = :email
			""")
	boolean existsByIdAndCoordinatorEmail(@Param("batchCycleId") Integer batchCycleId, @Param("email") String email);

	@Query("""
			SELECT DISTINCT bc
			FROM BatchCycle bc
			JOIN bc.courses c
			WHERE c.coordinator.email = :email
			""")
	List<BatchCycle> findAllByCoursesCoordinatorEmail(@Param("email") String email);
}
