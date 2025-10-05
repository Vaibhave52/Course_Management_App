package com.app.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class SessionReqDto {

	private String title;

	private String codeShareToken;

	private LocalDate sessionDate;

	private LocalTime startTime;

	private LocalTime endTime;

	private String zoomMeetingId;

	private String zoomMeetingPassword;

	private String description;

	private Integer courseModuleId;

}
