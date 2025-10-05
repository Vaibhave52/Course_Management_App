package com.app.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "menu_items")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MenuItems extends BaseEntity {
	
	@Column(name = "title",nullable = false,length = 100)
	private String title;
	
	@Column(name = "description",nullable = false,length = 200)
	private String description;
	
	@Column(name = "path",nullable = false,length = 100)
	private String path;
	
	@ManyToMany(mappedBy = "menuitems")
	private List<Role> roles;

}
