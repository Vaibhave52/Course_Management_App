package com.app.dao;

import java.util.List;

import java.util.List;

import java.util.List;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.Topic;

public interface TopicDao extends JpaRepository<Topic, Integer> {

	List<Topic> findAllBySectionId(int sectionId);

}
