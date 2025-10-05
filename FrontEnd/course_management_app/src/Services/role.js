// roleApi.js
import axiosInstance from "./axiosInstance";

// 🔹 Fetch all roles
export const getAllRoles = () => {
  return axiosInstance.get("/roles/getall");
};

// 🔹 Get role by ID
export const getRoleById = (id) => {
  return axiosInstance.get(`/roles/getbyid/${id}`);
};

// 🔹 Create a new role
export const createRole = (data) => {
  return axiosInstance.post("/roles/add", data);
};

// 🔹 Update an existing role
export const editRole = (id, data) => {
  return axiosInstance.put(`/roles/update/${id}`, data);
};

// 🔹 Delete a role
export const deleteRole = (id) => {
  return axiosInstance.delete(`/roles/delete/${id}`);
};
