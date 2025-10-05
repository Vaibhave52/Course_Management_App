package com.app.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.MenuItemsDao;
import com.app.dto.MenuItemReqDto;
import com.app.dto.MenuItemRespDto;
import com.app.entity.MenuItems;

import jakarta.transaction.Transactional;

@Service
public class MenuItemsServiceImpl implements MenuItemsService {

	@Autowired
	private MenuItemsDao menuDao;

	@Override
	@Transactional
	public MenuItemRespDto addMenuItem(MenuItemReqDto menuI) {
		MenuItems menu = convertToEntity(menuI);

		// Save the menu first
		MenuItems savedMenu = menuDao.save(menu);
		return convertToRespDto(savedMenu);
	}

	@Override
	@Transactional
	public MenuItemRespDto getMenuItembyId(int id) {

		MenuItems item = menuDao.findById(id)
				.orElseThrow(() -> new RuntimeException("MenuItem is not found by id " + id));
		return convertToRespDto(item);
	}

	@Override
	@Transactional
	public MenuItemRespDto updateMenuItem(int id, MenuItemReqDto menuI) {

		MenuItems item = menuDao.findById(id)
				.orElseThrow(() -> new RuntimeException("MenuItem is not found by id " + id));

		item.setTitle(menuI.getTitle());
		item.setDescription(menuI.getDescription());
		item.setPath(menuI.getPath());

		MenuItems save = menuDao.save(item);

		return convertToRespDto(save);
	}

	@Transactional
	@Override
	public List<MenuItemRespDto> getAllMenuItem() {

		List<MenuItems> all = menuDao.findAll();

		return all.stream().map(m -> convertToRespDto(m)).toList();
	}

	@Override
	@Transactional
	public String deleteMenuItem(int id) {

		MenuItems item = menuDao.findById(id)
				.orElseThrow(() -> new RuntimeException("MenuItem is not found by id " + id));

		menuDao.delete(item);

		return "Menu item deleted successfully";
	}

	private MenuItems convertToEntity(MenuItemReqDto dto) {
		MenuItems menu = new MenuItems();
		menu.setTitle(dto.getTitle());
		menu.setDescription(dto.getDescription());
		menu.setPath(dto.getPath());
		return menu;
	}

	private MenuItemRespDto convertToRespDto(MenuItems s) {
		MenuItemRespDto dto = new MenuItemRespDto();
		dto.setId(s.getId());
		dto.setTitle(s.getTitle());
		dto.setDescription(s.getDescription());
		dto.setPath(s.getPath());

		return dto;
	}

}
