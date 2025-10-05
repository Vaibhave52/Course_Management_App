package com.app.entity;

import java.time.LocalDateTime;
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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Table(name = "course")
@AllArgsConstructor
@Getter
@Setter
@Builder

public class Course extends BaseEntity {

	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@Column(name = "description", nullable = false, length = 200)
	private String description;

	@Column(name = "start_date", nullable = false)
	private LocalDateTime startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDateTime endDate;

	@ManyToOne
	@JoinColumn(name = "batch_cycle_id")
	private BatchCycle batchCycle;
	
	@OneToMany(mappedBy = "course",cascade = CascadeType.ALL)
	private List<Group> group;

	@ManyToMany()
	@JoinTable(
	    name = "course_premises",
	    joinColumns = @JoinColumn(name = "course_id"),
	    inverseJoinColumns = @JoinColumn(name = "premises_id")
	)
	private List<Premises> premisesList ;

	@ManyToOne
	@JoinColumn(name = "course_type_id")
	private CourseType courseType;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "course_staff",
			joinColumns = @JoinColumn(name = "course_id"),
			inverseJoinColumns = @JoinColumn(name = "staff_id")
	)
	private List<Staff> staff;
	
	@ManyToOne
	@JoinColumn(name = "coordinator_id") 				
	private Staff coordinator;

	@OneToMany(mappedBy = "course" , cascade = CascadeType.ALL,orphanRemoval = true)
	private List<Student> students;
	
	@ManyToMany(mappedBy = "courses" , fetch = FetchType.EAGER)
	private List<CourseModule> modules;

}
