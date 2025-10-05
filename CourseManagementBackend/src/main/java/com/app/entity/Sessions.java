package com.app.entity;

import java.time.LocalDate;
import java.time.LocalTime;

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
@Table(name = "session")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class Sessions extends BaseEntity {

	@Column(name = "title", nullable = false, length = 50)
	private String title;

	@Column(name = "code_share_token", length = 50)
	private String codeShareToken;

	@Column(name = "session_date", nullable = false)
	private LocalDate sessionDate;

	@Column(name = "start_time", nullable = false)
	private LocalTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalTime endTime;

	@Column(name = "zoom_id", nullable = false, length = 50)
	private String zoomMeetingId;

	@Column(name = "zoom_password", nullable = false, length = 30)
	private String zoomMeetingPassword;

	@Column(name = "description", length = 255)
	private String description;

	@ManyToOne
	@JoinColumn(name = "course_module_id", nullable = false)
	private CourseModule courseModule;
}
