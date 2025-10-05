package com.app.entity;

import java.util.List;

import com.app.entity.enums.StaffType;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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

@Entity
@Table(name = "staff")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Staff extends BaseEntity {

	@Column(name = "name", nullable = false, length = 30)
	private String name;

	@Column(name = "password", nullable = false, length = 100)
	private String password;

	@Column(name = "mobile_no", nullable = false, length = 13, unique = true)
	private String mobileNo;

	@Column(name = "email", nullable = false, length = 30, unique = true)
	private String email;

	@Enumerated(EnumType.STRING)
	private StaffType staffType;

	@ManyToOne
	@JoinColumn(name = "role_id", nullable = true)
	@JsonBackReference
	private Role role;

	@ManyToMany(mappedBy = "staff", fetch = FetchType.EAGER)
	private List<Course> courses;

	@ManyToMany(mappedBy = "staff")
	private List<Schedule> schedules;

	@OneToMany(mappedBy = "staff")
	private List<CourseModule> courseModules;

	@OneToMany(mappedBy = "coordinator")
	private List<Course> coordinatedCourses;

}
