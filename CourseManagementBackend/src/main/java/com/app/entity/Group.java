package com.app.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "course_group")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class Group extends BaseEntity {

	@Column(name = "name", nullable = false, length = 50)
	private String groupName;

	@Column(name = "description", nullable = false, length = 100)
	private String description;

	@ManyToOne
	@JoinColumn(name = "course_id", nullable = false)
	@JsonIgnoreProperties({ "description", "startDate", "endDate", "batchCycle", "premisesList", "courseType", "staff",
			"students" })
	private Course course;

	@ManyToMany(mappedBy = "groups")
	private List<Schedule> schedules;

	@OneToMany(mappedBy = "group")
	private List<Student> students;

}
