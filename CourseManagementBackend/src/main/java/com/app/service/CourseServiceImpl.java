package com.app.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dao.BatchCycleDao;
import com.app.dao.CourseDao;
import com.app.dao.CourseModuleDao;
import com.app.dao.CourseTypeDao;
import com.app.dao.PremisesDao;
import com.app.dao.RoleDao;
import com.app.dao.StaffDao;
import com.app.dto.CourseReqDto;
import com.app.dto.CourseRespDto;
import com.app.entity.BatchCycle;
import com.app.entity.Course;
import com.app.entity.CourseModule;
import com.app.entity.Premises;
import com.app.entity.Role;
import com.app.entity.Staff;
import com.app.exceptions.ResourseNotFoundException;

import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

@Service
@Transactional
@Slf4j
public class CourseServiceImpl implements CourseService {

    @Autowired 
    private final CourseDao courseDao;
    
    
    @Autowired 
    private final BatchCycleDao batchCycleDao;
    
    
    @Autowired 
    private final CourseTypeDao courseTypeDao;
    
    
    @Autowired 
    private final PremisesDao premisesDao;
    
    
    @Autowired 
    private final CourseModuleDao courseModuleDao;
    
    
    @Autowired 
    private final StaffDao staffDao;
    
    
    @Autowired 
    private RoleDao roleDao;

    public CourseServiceImpl(CourseDao courseDao, StaffDao staffDao, BatchCycleDao batchCycleDao,
                             CourseTypeDao courseTypeDao, PremisesDao premisesDao, CourseModuleDao courseModuleDao) {
        this.courseDao = courseDao;
        this.staffDao = staffDao;
        this.batchCycleDao = batchCycleDao;
        this.courseTypeDao = courseTypeDao;
        this.premisesDao = premisesDao;
        this.courseModuleDao = courseModuleDao;
    }

    // ---------------------------------------------------------
    // Get All / By ID
    // ---------------------------------------------------------
    public List<CourseRespDto> getAllCourses() {
        return courseDao.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CourseRespDto getCourseById(int id) {
        Course course = courseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id " + id));
        return convertToDto(course);
    }

    private CourseRespDto convertToDto(Course course) {
        CourseRespDto dto = CourseRespDto.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .startDate(course.getStartDate().toLocalDate())
                .endDate(course.getEndDate().toLocalDate())
                .batchCycleTitle(course.getBatchCycle() != null ? course.getBatchCycle().getName() : null)
                .CourseTypeName(course.getCourseType() != null ? course.getCourseType().getTitle() : null)
                .premisesName(course.getPremisesList() != null
                        ? course.getPremisesList().stream().map(Premises::getInstituteName).toList()
                        : null)
                .coordinatorId(course.getCoordinator() != null ? course.getCoordinator().getId() : null)
                .coordinatorName(course.getCoordinator() != null ? course.getCoordinator().getName() : "No Coordinator Assigned")
                .modules(course.getModules() != null
                        ? course.getModules().stream().map(CourseModule::getTitle).toList()
                        : new ArrayList<>())
                .build();

        if (course.getBatchCycle() != null) {
            dto.setStatus(Boolean.TRUE.equals(course.getBatchCycle().getIsActive()) ? "Active" : "Closed");
        }
        dto.setStaffName(course.getCoordinator() != null ? course.getCoordinator().getName() : "No Coordinator Assigned");
        dto.setStudentCount(course.getStudents() != null ? course.getStudents().size() : 0);

        return dto;
    }

    // ---------------------------------------------------------
    // Add Course
    // ---------------------------------------------------------
    public CourseRespDto addCourse(CourseReqDto dto) {
        Course course = new Course();
        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setStartDate(dto.getStartDate().atStartOfDay());
        course.setEndDate(dto.getEndDate().atStartOfDay());

        course.setBatchCycle(batchCycleDao.findById(dto.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found with id: " + dto.getBatchCycleId())));

        course.setCourseType(courseTypeDao.findById(dto.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("CourseType not found")));

        List<Premises> premises = dto.getPremisesId().stream()
                .map(id -> premisesDao.findById(id).orElseThrow(() -> new RuntimeException("Premises not found")))
                .toList();
        course.setPremisesList(premises);

        if (dto.getCoordinatorId() != null) {
            Staff coordinator = staffDao.findById(dto.getCoordinatorId())
                    .orElseThrow(() -> new RuntimeException("Coordinator not found"));

            Role coordinatorRole = roleDao.findByName("COORDINATOR")
                    .orElseThrow(() -> new RuntimeException("Coordinator Role not found"));
            coordinator.setRole(coordinatorRole);

            coordinator = staffDao.save(coordinator); // ✅ save to persist role change
            course.setCoordinator(coordinator);
        }

        Course saved = courseDao.save(course);
        return convertToDto(saved);
    }

    // ---------------------------------------------------------
    // Update Course
    // ---------------------------------------------------------
    public CourseRespDto updateCourse(int id, CourseReqDto dto) {
        Course course = courseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setStartDate(dto.getStartDate().atStartOfDay());
        course.setEndDate(dto.getEndDate().atStartOfDay());

        course.setBatchCycle(batchCycleDao.findById(dto.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found")));
        course.setCourseType(courseTypeDao.findById(dto.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("CourseType not found")));

        List<Premises> premises = dto.getPremisesId().stream()
                .map(pId -> premisesDao.findById(pId)
                        .orElseThrow(() -> new RuntimeException("Premises not found")))
                .collect(Collectors.toList());
        course.setPremisesList(premises);

        if (dto.getStaffIds() != null) {
            List<Staff> staffList = dto.getStaffIds().stream()
                    .map(sid -> staffDao.findById(sid)
                            .orElseThrow(() -> new RuntimeException("Staff not found")))
                    .collect(Collectors.toList());
            course.setStaff(staffList);
        }

        Staff previousCoordinator = course.getCoordinator();

        if (dto.getCoordinatorId() != null) {
            Staff newCoordinator = staffDao.findById(dto.getCoordinatorId())
                    .orElseThrow(() -> new RuntimeException("Coordinator not found"));
            Role coordinatorRole = roleDao.findByName("COORDINATOR")
                    .orElseThrow(() -> new RuntimeException("Coordinator role not found"));
            newCoordinator.setRole(coordinatorRole);

            newCoordinator = staffDao.save(newCoordinator); // ✅ persist role change
            course.setCoordinator(newCoordinator);
        } else {
            course.setCoordinator(null);
        }

        // revert previous coordinator if no longer coordinator anywhere
        if (previousCoordinator != null &&
                (dto.getCoordinatorId() == null || !previousCoordinator.getId().equals(dto.getCoordinatorId()))) {
            boolean isCoordinatorElsewhere = courseDao.existsByCoordinatorId(previousCoordinator.getId());
            if (!isCoordinatorElsewhere) {
                Role defaultRole = roleDao.findByName("STAFF").orElseGet(() -> {
        			Role newRole = new Role();
        			newRole.setName("STAFF");
        			newRole.setDescription("STAFF Related functionality");
        			return roleDao.save(newRole);}
                );
                        
                previousCoordinator.setRole(defaultRole);
                staffDao.save(previousCoordinator);
            }
        }

        Course updated = courseDao.save(course);
        return convertToDto(updated);
    }

    // ---------------------------------------------------------
    // Delete Course
    // ---------------------------------------------------------
    public String deleteCourse(int id) {
        Course course = courseDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Staff coordinator = course.getCoordinator();

        courseDao.delete(course);

        if (coordinator != null) {
            boolean isCoordinatorElsewhere = courseDao.existsByCoordinatorId(coordinator.getId());
            if (!isCoordinatorElsewhere) {
                Role defaultRole = roleDao.findByName("STAFF")
                        .orElseThrow(() -> new RuntimeException("Default staff role not found"));
                coordinator.setRole(defaultRole);
                staffDao.save(coordinator);
            }
        }
        return "Deleted successfully";
    }

    // ---------------------------------------------------------
    // Unlink Modules
    // ---------------------------------------------------------
    public CourseRespDto unlinkModulesFromCourse(int courseId, List<Integer> moduleIds) {
        Course course = courseDao.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.getModules().removeIf(m -> moduleIds.contains(m.getId()));

        Course updated = courseDao.save(course);
        return convertToDto(updated);
    }

    // ---------------------------------------------------------
    // Assign Coordinator
    // ---------------------------------------------------------
    public CourseRespDto assignCoordinator(int courseId, int staffId) {
        Course course = courseDao.findById(courseId)
                .orElseThrow(() -> new ResourseNotFoundException("Course not found with id " + courseId));

        Staff coordinator = staffDao.findById(staffId)
                .orElseThrow(() -> new ResourseNotFoundException("Staff not found with id " + staffId));

        Role coordinatorRole = roleDao.findByName("COORDINATOR")
                .orElseThrow(() -> new ResourseNotFoundException("Coordinator Role not found"));

        coordinator.setRole(coordinatorRole);
        coordinator = staffDao.save(coordinator); // ✅ persist role change

        course.setCoordinator(coordinator);
        courseDao.save(course);

        return convertToDto(course);
    }

    // ---------------------------------------------------------
    // Remove Coordinator
    // ---------------------------------------------------------
    public CourseRespDto removeCoordinator(int courseId) {
        Course course = courseDao.findById(courseId)
                .orElseThrow(() -> new ResourseNotFoundException("Course not found with id " + courseId));

        Staff previousCoordinator = course.getCoordinator();
        course.setCoordinator(null);

        if (previousCoordinator != null) {
            boolean isCoordinatorElsewhere = courseDao.existsByCoordinatorId(previousCoordinator.getId());
            if (!isCoordinatorElsewhere) {
                Role defaultRole = roleDao.findByName("STAFF")
                        .orElseThrow(() -> new RuntimeException("Default staff role not found"));
                previousCoordinator.setRole(defaultRole);
                staffDao.save(previousCoordinator);
            }
        }

        Course updated = courseDao.save(course);
        return convertToDto(updated);
    }

	@Override
	public List<CourseRespDto> getCoursesByCoordinatorEmail(String email) {
		List<Course> courses = courseDao.findByCoordinatorEmail(email);
		System.out.println("Courses for coordinator " + email + ": " + courses.size());
        return courses.stream()
                      .map(this::convertToDto)
                      .toList();
	}
}