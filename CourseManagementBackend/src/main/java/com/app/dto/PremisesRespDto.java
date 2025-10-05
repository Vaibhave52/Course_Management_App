package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PremisesRespDto {

	private int id;

	private String instituteName;

	private String address;

	private String description;
}
