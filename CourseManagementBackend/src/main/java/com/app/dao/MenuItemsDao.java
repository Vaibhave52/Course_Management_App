package com.app.dao;
import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entity.MenuItems;

public interface MenuItemsDao extends JpaRepository<MenuItems, Integer> {

}
