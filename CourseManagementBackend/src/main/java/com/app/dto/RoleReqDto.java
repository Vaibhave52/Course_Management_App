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
public class RoleReqDto {

	private String name;

	private String description;

	private List<Integer> menuItemIds; // IDs of menu items linked to this role
}
