package com.app.entity;

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
@Table(name = "student")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Student extends BaseEntity {
	
	@Column(name = "reg_no",nullable = false)
	private int registrationNo;
	
	@Column(name = "name",nullable = false,length = 30)
	private String name;
	
	@Column(name = "password",nullable = false,length = 30)
	private String password;
	
	@Column(name = "mobile_no",nullable = false,length = 13,unique = true)
	private String mobileNo;

	@Column(name = "email",nullable = false,unique = true,length = 30)
	private String email;
	
	@ManyToOne
	@JoinColumn(name = "course_id")
	private Course course;
	
	@ManyToOne
	@JoinColumn(name = "batch_id")
	private BatchCycle batch;
	
	@ManyToOne
	@JoinColumn(name = "group_id")
	private Group group;
	
}
