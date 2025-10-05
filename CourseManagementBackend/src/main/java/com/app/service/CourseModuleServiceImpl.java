package com.app.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.app.dao.CourseDao;
import com.app.dao.CourseModuleDao;
import com.app.dao.StaffDao;
import com.app.dto.CourseModuleReqDto;
import com.app.dto.CourseModuleRespDto;
import com.app.entity.Course;
import com.app.entity.CourseModule;
import com.app.entity.Staff;
import com.app.exceptions.ResourseNotFoundException;

@Service
public class CourseModuleServiceImpl implements CourseModuleService {

	@Autowired
	private CourseModuleDao courseModuleDao;

	@Autowired
	private CourseDao courseDao; // inject your Course repository

	@Autowired
	private StaffDao staffDao;

	@Autowired
	@Qualifier("courseModuleMapper")
	private ModelMapper modelMapper;

	@Override
	public CourseModuleRespDto addCourseModule(CourseModuleReqDto courseModuleDto) {

		// 1️⃣ Fetch the staff by ID
		Staff staff = staffDao.findById(courseModuleDto.getStaffId())
				.orElseThrow(() -> new RuntimeException("Staff not found with id " + courseModuleDto.getStaffId()));

		// 2️⃣ Map basic properties (title, description, hours)
		CourseModule courseModule = modelMapper.map(courseModuleDto, CourseModule.class);
		courseModule.setId(null);
		courseModule.setStaff(staff);

		// 3️⃣ Fetch the course(s) and set
		Course course = courseDao.findById(courseModuleDto.getCourseId()) // assuming single course
				.orElseThrow(() -> new RuntimeException("Course not found with id " + courseModuleDto.getCourseId()));

		courseModule.setCourses(List.of(course)); // set the course list

		// 4️⃣ Save to DB (this will populate the join table)
		CourseModule savedModule = courseModuleDao.save(courseModule);

		// 5️⃣ Map to response DTO
		CourseModuleRespDto map = modelMapper.map(savedModule, CourseModuleRespDto.class);
		map.setCourseIds(List.of(course.getId()));
		return map;
	}

	@Override
	public CourseModuleRespDto updateCourseModule(Integer id, CourseModuleReqDto updatedDto) {

		CourseModule existing = courseModuleDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Course Module not found with id " + id));

		existing.setTitle(updatedDto.getTitle());
		existing.setDescription(updatedDto.getDescription());
		existing.setTheoryHours(updatedDto.getTheoryHours());
		existing.setPracticalHours(updatedDto.getPracticalHours());

		// Update staff
		Staff staff = staffDao.findById(updatedDto.getStaffId())
				.orElseThrow(() -> new RuntimeException("Staff not found with id " + updatedDto.getStaffId()));
		existing.setStaff(staff);

		// TODO: Update Course if needed
		Course course = courseDao.findById(updatedDto.getCourseId())
				.orElseThrow(() -> new ResourseNotFoundException("Course is not found "));
		existing.setCourses(List.of(course));

		CourseModule savedModule = courseModuleDao.save(existing);

		CourseModuleRespDto map = modelMapper.map(savedModule, CourseModuleRespDto.class);
		map.setCourseIds(List.of(course.getId()));
		map.setCourseNames(List.of(course.getName()));
		return map;
	}

	@Override
	public void deleteCourseModule(Integer id) {
		courseModuleDao.deleteById(id);
	}

	@Override
	public CourseModuleRespDto getCourseModuleById(Integer id) {
		CourseModule cModule = courseModuleDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Course Module not found with id " + id));

		CourseModuleRespDto dto = modelMapper.map(cModule, CourseModuleRespDto.class);

		if (cModule.getCourses() != null) {
			// Set course IDs
			List<Integer> courseIds = cModule.getCourses().stream().map(Course::getId).toList();
			dto.setCourseIds(courseIds);

			// Set course names
			List<String> courseNames = cModule.getCourses().stream().map(Course::getName).toList();
			dto.setCourseNames(courseNames);
		}

		// Optionally set staff name
		if (cModule.getStaff() != null) {
			dto.setStaffName(cModule.getStaff().getName());
		}

		return dto;
	}

	@Override
	public List<CourseModuleRespDto> getAllCourseModules() {
		List<CourseModule> modules = courseModuleDao.findAll();

		return modules.stream().map(module -> {
			CourseModuleRespDto dto = modelMapper.map(module, CourseModuleRespDto.class);

			if (module.getCourses() != null) {
				// Set course names
				List<String> courseNames = module.getCourses().stream().map(Course::getName).toList();
				dto.setCourseNames(courseNames);

				// Set course IDs
				List<Integer> courseIds = module.getCourses().stream().map(Course::getId).toList();
				dto.setCourseIds(courseIds);
			}

			// Optionally set staff name
			if (module.getStaff() != null) {
				dto.setStaffName(module.getStaff().getName());
			}

			return dto;
		}).toList();
	}

}
