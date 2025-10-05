package com.app.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recordings")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class RecordedVideo extends BaseEntity {

	@Column(name = "video_title",nullable = false,length = 100)
	private String videoTitle;
	
	@Column(name = "date",nullable = false)
	private LocalDateTime date;
	
	@Column(name = "video_url",nullable = false,length = 200)
	private String videoUrl;
	
	@ManyToOne
	@JoinColumn(name = "course_module_id", nullable = false)
	private CourseModule courseModule;

}
