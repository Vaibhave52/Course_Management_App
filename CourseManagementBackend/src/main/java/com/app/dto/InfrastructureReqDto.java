package com.app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InfrastructureReqDto {

	private String title;

	private String description;

	private String infrastructureType;

	private Integer premisesId;

}
