package com.app.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SessionRespDto {

	private int id;

	private String title;

	private String codeShareToken;

	private LocalDate sessionDate;

	private LocalTime startTime;

	private LocalTime endTime;

	private String zoomMeetingId;

	private String zoomMeetingPassword;

	private String description;

	private String courseModuleName;

	private Integer courseModuleId; // new

	private Boolean active;
}
