// premisesApi.js
import axiosInstance from "./axiosInstance";

// 🔹 Fetch all premises
export const getallPremises = () => {
  return axiosInstance.get("/premises/getall");
};

// 🔹 Delete a premise
export const deletePremises = (id) => {
  return axiosInstance.delete(`/premises/delete/${id}`);
};

// 🔹 Update a premise
export const editPremises = (id, data) => {
  return axiosInstance.put(`/premises/edit/${id}`, data);
};

// 🔹 Create a new premise
export const createPremises = (data) => {
  return axiosInstance.post("/premises/add", data);
};
