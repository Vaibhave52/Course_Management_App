
package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.BatchCycleDao;
import com.app.dao.CourseDao;
import com.app.dao.GroupDao;
import com.app.dao.StudentDao;
import com.app.dto.StudentReqDto;
import com.app.entity.BatchCycle;
import com.app.entity.Course;
import com.app.entity.Group;
import com.app.entity.Student;
import com.app.dto.StudentRespDto;

@Service
public class StudentServiceImpl implements StudentService {

	@Autowired
	private StudentDao studentDao;

	@Autowired
	private CourseDao courseDao;

	@Autowired
	private GroupDao groupDao;

	@Autowired
	private BatchCycleDao batchDao;

	@Override
	public StudentRespDto addStudent(StudentReqDto studentDto) {

		Student student = convertToStudent(studentDto);

		Student save = studentDao.save(student);

		return convertToStudentRespDto(save);
	}

	private StudentRespDto convertToStudentRespDto(Student s) {

		StudentRespDto dto = new StudentRespDto();
		dto.setId(s.getId());
		dto.setRegistrationNo(s.getRegistrationNo());
		dto.setName(s.getName());
		dto.setPassword(s.getPassword());
		dto.setMobileNo(s.getMobileNo());
		dto.setEmail(s.getEmail());
		dto.setCourseName(s.getCourse().getName());
		dto.setBatchName(s.getBatch().getName());
		dto.setGroupName(s.getGroup().getGroupName());

		return dto;
	}

	private Student convertToStudent(StudentReqDto dto) {

		Course course = courseDao.findById(dto.getCourseId())
				.orElseThrow(() -> new RuntimeException("Course not found by id " + dto.getCourseId()));

		Group group = groupDao.findById(dto.getGroupId())
				.orElseThrow(() -> new RuntimeException("Group not found by id " + dto.getGroupId()));

		BatchCycle batchCycle = batchDao.findById(dto.getBatchId())
				.orElseThrow(() -> new RuntimeException("Batch Cycle not found by id " + dto.getBatchId()));

		Student student = new Student();

		student.setRegistrationNo(dto.getRegistrationNo());
		student.setName(dto.getName());
		student.setPassword(dto.getPassword());
		student.setMobileNo(dto.getMobileNo());
		student.setEmail(dto.getEmail());

		student.setCourse(course);
		student.setBatch(batchCycle);
		student.setGroup(group);

		return student;
	}

	@Override
	public StudentRespDto updateStudent(Integer id, StudentReqDto dto) {

		Student existingStudent = studentDao.findById(id)
				.orElseThrow(() -> new RuntimeException("Student not found by id " + id));

		Course course = courseDao.findById(dto.getCourseId())
				.orElseThrow(() -> new RuntimeException("Course not found by id " + dto.getCourseId()));

		Group group = groupDao.findById(dto.getGroupId())
				.orElseThrow(() -> new RuntimeException("Group not found by id " + dto.getGroupId()));

		BatchCycle batchCycle = batchDao.findById(dto.getBatchId())
				.orElseThrow(() -> new RuntimeException("Batch Cycle not found by id " + dto.getBatchId()));

		existingStudent.setRegistrationNo(dto.getRegistrationNo());
		existingStudent.setName(dto.getName());
		existingStudent.setPassword(dto.getPassword());
		existingStudent.setMobileNo(dto.getMobileNo());
		existingStudent.setEmail(dto.getEmail());

		existingStudent.setCourse(course);
		existingStudent.setBatch(batchCycle);
		existingStudent.setGroup(group);

		Student save = studentDao.save(existingStudent);

		return convertToStudentRespDto(save);
	}

	@Override
	public void deleteStudent(Integer id) {
		studentDao.deleteById(id);
	}

	@Override
	public StudentRespDto getStudentById(Integer id) {
		return convertToStudentRespDto(
				studentDao.findById(id).orElseThrow(() -> new RuntimeException("Student not found by id " + id)));
	}

	@Override
	public List<StudentRespDto> getAllStudents() {

		List<Student> list = studentDao.findAll();

		return list.stream().map(s -> convertToStudentRespDto(s)).toList();
	}
}
