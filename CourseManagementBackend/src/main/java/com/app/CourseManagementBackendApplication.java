package com.app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.dao.RoleDao;
import com.app.dao.StaffDao;
import com.app.entity.Role;
import com.app.entity.Staff;
import com.app.entity.enums.StaffType;
import com.app.service.StaffService;

@SpringBootApplication
public class CourseManagementBackendApplication implements CommandLineRunner {

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private StaffService staffService;

	@Autowired
	private RoleDao roleDao;

	@Autowired
	private StaffDao staffDao;

	public static void main(String[] args) {
		SpringApplication.run(CourseManagementBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {

		// ===== Check or create ADMIN role =====
		Role role = roleDao.findByName("ADMIN").orElseGet(() -> {
			Role newRole = new Role();
			newRole.setName("ADMIN");
			newRole.setDescription("ADMIN Related functionality");
			return roleDao.save(newRole);
		});

		// ===== Check or create Admin staff =====
		Staff staff = staffDao.findByName("Admin").orElseGet(() -> {
			Staff newStaff = new Staff();
			newStaff.setName("Admin");
			newStaff.setPassword(passwordEncoder.encode("Admin@123"));
			newStaff.setMobileNo("8928154967");
			newStaff.setEmail("admin@gmail.com");
			newStaff.setStaffType(StaffType.VISITING);
			newStaff.setRole(role);
			return staffDao.save(newStaff);
		});

		System.out.println("Startup data check complete!");
	}

}
