package com.app.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class CourseModule extends BaseEntity {

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@Column(name = "description", nullable = false, length = 200)
	private String description;

	@Column(name = "theory_hours", nullable = false, length = 20)
	private String theoryHours;

	@Column(name = "practical_hours", nullable = false, length = 20)
	private String practicalHours;

	@ManyToOne
	@JoinColumn(name = "module_router_id")
	private Staff staff;

	@OneToMany(mappedBy = "courseModule", cascade = CascadeType.ALL)
	private List<Subject> subjects;

	@OneToMany(mappedBy = "courseModule", cascade = CascadeType.ALL)
	private List<Schedule> schedules;

	@OneToMany(mappedBy = "courseModule", cascade = CascadeType.ALL)
	private List<RecordedVideo> recordedVideos;

	@OneToMany(mappedBy = "courseModule", cascade = CascadeType.ALL)
	private List<Sessions> sessions;
	
	@ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "course_modules", 
        joinColumns = @JoinColumn(name = "module_id"),        // FK to CourseModule
        inverseJoinColumns = @JoinColumn(name = "course_id")  // FK to Course
    )
    private List<Course> courses;

}
