package com.app.service;

import java.util.List;

import com.app.dto.MenuItemReqDto;
import com.app.dto.MenuItemRespDto;

public interface MenuItemsService {

	MenuItemRespDto addMenuItem(MenuItemReqDto menuI);

	MenuItemRespDto updateMenuItem(int id, MenuItemReqDto menuI);

	List<MenuItemRespDto> getAllMenuItem();

	String deleteMenuItem(int id);
	
	MenuItemRespDto getMenuItembyId(int id);
	
	

}
