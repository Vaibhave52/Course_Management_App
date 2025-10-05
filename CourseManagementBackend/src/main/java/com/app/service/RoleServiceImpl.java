package com.app.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.MenuItemsDao;
import com.app.dao.RoleDao;
import com.app.dto.RoleReqDto;
import com.app.dto.RoleRespDto;
import com.app.entity.MenuItems;
import com.app.entity.Role;

import jakarta.transaction.Transactional;

@Service
public class RoleServiceImpl implements RoleService {

	@Autowired
	MenuItemsDao menuDao;

	@Autowired
	RoleDao roleDao;

	@Override
	@Transactional
	public RoleRespDto addRole(RoleReqDto roleDto) {

		Role role = convertToEntity(roleDto);
		
		Role savedRole = roleDao.save(role);

		// Save the owning side (menu items) to persist the join table
		for (MenuItems menu : savedRole.getMenuitems()) {
			menuDao.save(menu); // 💾 Persist the relationship in join table
		}
		return convertToRespDto(savedRole);
	}

	@Override
	@Transactional
	public RoleRespDto updateRole(RoleReqDto roleDto, int id) {
		Role role = roleDao.findById(id).orElseThrow(() -> new RuntimeException("Role not found by id " + id));

		role.setName(roleDto.getName());
		role.setDescription(roleDto.getDescription());

		if (roleDto.getMenuItemIds() != null && !roleDto.getMenuItemIds().isEmpty()) {
			List<MenuItems> menuItems = menuDao.findAllById(roleDto.getMenuItemIds());
			role.setMenuitems(menuItems);

			// keep both sides in sync
			for (MenuItems menu : menuItems) {
				if (menu.getRoles() == null) {
					menu.setRoles(new ArrayList<>());
				}
				if (!menu.getRoles().contains(role)) {
					menu.getRoles().add(role);
				}
			}
		}

		Role updatedRole = roleDao.save(role);
		updatedRole.getMenuitems().size(); // initialize lazy collection

		return convertToRespDto(updatedRole);
	}

	@Override
	@Transactional
	public RoleRespDto getRoleById(int id) {
		Role role = roleDao.findById(id).orElseThrow(() -> new RuntimeException("Role not found by id " + id));
		role.getMenuitems().size(); // initialize lazy collection
		return convertToRespDto(role);
	}

	@Override
	@Transactional
	public List<RoleRespDto> getAllRole() {
		List<Role> allRoles = roleDao.findAll();
		return allRoles.stream().map(this::convertToRespDto).toList();
	}

	@Override
	@Transactional
	public String deleteRole(int id) {
		Role role = roleDao.findById(id).orElseThrow(() -> new RuntimeException("Role not found by id " + id));
		roleDao.delete(role);
		return "Role deleted successfully";
	}

	private Role convertToEntity(RoleReqDto dto) {
		Role role = new Role();
		role.setName(dto.getName());
		role.setDescription(dto.getDescription());

		// Fetch menu items from DB
		List<MenuItems> menuItems = menuDao.findAllById(dto.getMenuItemIds());

		// Assign menu items to role
		role.setMenuitems(menuItems);

		// 🔁 Keep both sides in sync
		for (MenuItems menu : menuItems) {
			if (menu.getRoles() == null) {
				menu.setRoles(new ArrayList<>());
			}
			menu.getRoles().add(role);
		}

		return role;
	}

	private RoleRespDto convertToRespDto(Role role) {
		RoleRespDto dto = new RoleRespDto();
		dto.setId(role.getId());
		dto.setName(role.getName());
		dto.setDescription(role.getDescription());

		// Extract menu titles from assigned menu items
		List<String> menuTitles = role.getMenuitems().stream().map(MenuItems::getTitle).toList();

		dto.setMenuTitles(menuTitles);

		return dto;
	}

}
