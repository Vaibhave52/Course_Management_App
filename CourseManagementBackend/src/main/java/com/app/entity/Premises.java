package com.app.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "premises")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Premises extends BaseEntity {
	@Column(name = "institute_name", nullable = false, length = 100)
	private String instituteName;

	@Column(name = "address", nullable = false, length = 150, unique = true)
	private String address;

	@Column(name = "description", nullable = false, length = 200)
	private String description;

	@ManyToMany(mappedBy = "premisesList")
	private List<Course> courses;

	@OneToMany(mappedBy = "premises",cascade = CascadeType.ALL)
	private List<Infrastructure> infrastructures;

}
