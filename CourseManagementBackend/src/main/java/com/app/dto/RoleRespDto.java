package com.app.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RoleRespDto {

	private int id;

	private String name;

	private String description;

	private List<String> menuTitles; // Names of assigned menu items
}
