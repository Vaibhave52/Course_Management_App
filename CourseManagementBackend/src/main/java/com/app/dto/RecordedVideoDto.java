package com.app.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecordedVideoDto {

	private String videoTitle;

	private String videoUrl;

	private LocalDateTime date;

	private Integer courseModuleId;
}
