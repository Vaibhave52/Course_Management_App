package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.MenuItemReqDto;
import com.app.dto.MenuItemRespDto;
import com.app.service.MenuItemsService;

@CrossOrigin("*")
@RestController
@RequestMapping("/menuitems")
public class MenuItemsController {

	@Autowired
	private MenuItemsService menuItems;

	@PostMapping("/add")
	public ResponseEntity<MenuItemRespDto> addMenuItem(@RequestBody MenuItemReqDto menuI) {
		MenuItemRespDto menu = menuItems.addMenuItem(menuI);

		return ResponseEntity.ok(menu);
	}

	@GetMapping("/getById/{id}")
	public ResponseEntity<MenuItemRespDto> getMenuItembyId(@PathVariable int id) {
		MenuItemRespDto data = menuItems.getMenuItembyId(id);

		return ResponseEntity.ok(data);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<MenuItemRespDto> updateMenuItem(@PathVariable int id, @RequestBody MenuItemReqDto menuI) {
		MenuItemRespDto menu = menuItems.updateMenuItem(id, menuI);

		return ResponseEntity.ok(menu);
	}

	@GetMapping("/getall")
	public ResponseEntity<List<MenuItemRespDto>> getAllMenuItems() {
		List<MenuItemRespDto> menu = menuItems.getAllMenuItem();

		return ResponseEntity.ok(menu);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteMapping(@PathVariable int id) {
		String msg = menuItems.deleteMenuItem(id);

		return ResponseEntity.ok(msg);
	}

}
