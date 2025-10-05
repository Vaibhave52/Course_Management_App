package com.app.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "schedule")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class Schedule extends BaseEntity {
	
	@Column(name = "date",nullable = false)
	private LocalDate date;
	
	@Column(name = "start_time",nullable = false)
	private LocalTime startTime;
	
	@Column(name = "end_time",nullable = false)
	private LocalTime endTime;
			
	@ManyToOne
	@JoinColumn(name="course_module_id")
	private CourseModule courseModule;
	
	@ManyToMany
	@JoinTable(
	    name = "schedule_infrastructure",
	    joinColumns = @JoinColumn(name = "schedule_id"),
	    inverseJoinColumns = @JoinColumn(name = "infra_id")
	)
	private List<Infrastructure> infrastructures;
	
	@ManyToMany
    @JoinTable(
        name = "schedule_group",
        joinColumns = @JoinColumn(name = "schedule_id"),
        inverseJoinColumns = @JoinColumn(name = "group_id")
    )
    private List<Group> groups;
	
	@ManyToMany
	@JoinTable(
	    name = "schedule_staff",
	    joinColumns = @JoinColumn(name = "schedule_id"),
	    inverseJoinColumns = @JoinColumn(name = "staff_id")
	)
	private List<Staff> staff;
	
	private String comment;

}