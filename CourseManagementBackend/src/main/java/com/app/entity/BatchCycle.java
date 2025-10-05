package com.app.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "batch_cycle")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class BatchCycle extends BaseEntity {
	
	@Column(name = "name",nullable = false,length = 100)
	private String name;
	
	@Column(name = "description",nullable = false,length = 200)
	private String description;
	
	@Column(name = "start_date",nullable = false)
    private LocalDateTime startDate;
	
	@Column(name = "end_date",nullable = false)
	private LocalDateTime endDate;
	
	@Column(name = "is_active")
	private Boolean isActive;
	
	@OneToMany(mappedBy = "batchCycle",cascade = CascadeType.ALL)
	private List<Course> courses ;
	
	@OneToMany(mappedBy = "batch",cascade = CascadeType.ALL)
	private List<Student> students;

}
