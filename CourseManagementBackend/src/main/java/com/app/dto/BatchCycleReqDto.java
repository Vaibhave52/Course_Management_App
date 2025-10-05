package com.app.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BatchCycleReqDto {

	private String name;

	private String description;

	private LocalDateTime startDate;

	private LocalDateTime endDate;

	private Boolean isActive;
}
