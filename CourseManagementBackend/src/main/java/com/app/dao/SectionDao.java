package com.app.dao;

import java.util.List;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.Section;

public interface SectionDao extends JpaRepository<Section, Integer> {

	List<Section> findAllBySubjectId(int subjectId);
}
