import axiosInstance from "./axiosInstance";

export const getAllStaff = () => axiosInstance.get("/staff/getall");
export const addStaff = (data) => axiosInstance.post("/staff/add", data);
export const updateStaff = (id, data) =>
  axiosInstance.put(`/staff/update/${id}`, data);
export const deleteStaff = (id) => axiosInstance.delete(`/staff/${id}`);
export const getAllRoles = () => axiosInstance.get("/roles/getall");
