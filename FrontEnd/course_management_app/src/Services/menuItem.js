// src/Services/menu.js
import axiosInstance from "./axiosInstance";

// 🔹 Fetch all menu items
export const getAllMenuItems = () => {
  return axiosInstance.get("/menuitems/getall");
};

// 🔹 Get menu item by ID
export const getMenuItemById = (id) => {
  return axiosInstance.get(`/menuitems/getById/${id}`);
};

// 🔹 Add a new menu item
export const createMenuItem = (data) => {
  return axiosInstance.post("/menuitems/add", data);
};

// 🔹 Update a menu item
export const updateMenuItem = (id, data) => {
  return axiosInstance.put(`/menuitems/update/${id}`, data);
};

// 🔹 Delete a menu item
export const deleteMenuItem = (id) => {
  return axiosInstance.delete(`/menuitems/delete/${id}`);
};
