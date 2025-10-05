package com.app.dao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.Premises;

public interface PremisesDao extends JpaRepository<Premises, Integer> {

	List<Premises> findAllById(int premisesId);
	

}
