package com.app.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.RoleDao;
import com.app.dao.StaffDao;
import com.app.dto.StaffReqDto;
import com.app.dto.StaffRespDto;
import com.app.entity.Role;
import com.app.entity.Staff;
import com.app.entity.enums.StaffType;

@Service
@Transactional
public class StaffServiceImpl implements StaffService {

	@Autowired
	private StaffDao staffDao;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public StaffRespDto addStaff(StaffReqDto staffDto) {

		Role role = roleDao.findById(staffDto.getRoleID())
				.orElseThrow(() -> new RuntimeException("Role not found by id " + staffDto.getRoleID()));

		Staff staff = new Staff();

		staff.setName(staffDto.getName());
		staff.setPassword(passwordEncoder.encode(staffDto.getPassword()));
		staff.setMobileNo(staffDto.getMobileNo());
		staff.setEmail(staffDto.getEmail());
		staff.setStaffType(StaffType.valueOf(staffDto.getStaffType()));
		staff.setRole(role);

		Staff s = staffDao.save(staff);

		StaffRespDto map = modelMapper.map(s, StaffRespDto.class);
		map.setRoleName(s.getRole().getName());

		return map;
	}

	@Override
	public StaffRespDto updateStaff(StaffReqDto staffDto, int staffId) {

		Staff staff = staffDao.findById(staffId).orElseThrow(() -> new RuntimeException("staff not found"));

		staff.setName(staffDto.getName());
		staff.setPassword(passwordEncoder.encode(staffDto.getPassword()));
		staff.setMobileNo(staffDto.getMobileNo());
		staff.setEmail(staffDto.getEmail());

		try {
			staff.setStaffType(StaffType.valueOf(staffDto.getStaffType()));
		} catch (IllegalArgumentException e) {
			throw new RuntimeException("Invalid staffType: " + staffDto.getStaffType());
		}

		// ✅ Only update role if `roleID` is present in DTO
		if (staffDto.getRoleID() != 0) {
			Role role = roleDao.findById(staffDto.getRoleID())
					.orElseThrow(() -> new RuntimeException("Role not found"));
			staff.setRole(role);
		}

		Staff s = staffDao.save(staff);

		StaffRespDto map = modelMapper.map(s, StaffRespDto.class);
		map.setRoleName(s.getRole().getName());

		return map;
	}

	@Override
	public String deleteStaff(int staffId) {

		Staff staff = staffDao.findById(staffId).orElseThrow(() -> new RuntimeException("staff not found"));

		// Check if staff is coordinator for any course
		if (staff.getCoordinatedCourses() != null && !staff.getCoordinatedCourses().isEmpty()) {
			throw new IllegalStateException(
					"Cannot delete staff: they are assigned as coordinator for one or more courses. "
							+ "Please reassign or remove them first.");
		}

		staffDao.delete(staff);

		return "Staff deleted successfully";
	}

	@Override
	public List<StaffRespDto> getAll() {
		return staffDao.findAll().stream().map(staff -> {
			StaffRespDto map = modelMapper.map(staff, StaffRespDto.class);
			map.setRoleName(staff.getRole().getName());
			return map;
		}).toList();
	}

	@Override
	public StaffRespDto getStaff(int staffId) {

		Staff staff = staffDao.findById(staffId).orElseThrow(() -> new RuntimeException("staff not found"));

		StaffRespDto map = modelMapper.map(staff, StaffRespDto.class);
		map.setRoleName(staff.getRole().getName());

		return map;
	}

	@Override
	public StaffRespDto getStaffByEmail(String email) {
		Staff staff = staffDao.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Staff not found with email: " + email));

		StaffRespDto map = modelMapper.map(staff, StaffRespDto.class);
		map.setRoleName(staff.getRole().getName());

		return map;
	}

}
