import axiosInstance from "./axiosInstance.js"; // ← your configured axios

export const getAllStudents = () => axiosInstance.get("/students");
export const deleteStudent = (id) => axiosInstance.delete(`/students/${id}`);
export const addStudent = (data) => axiosInstance.post("/students", data);
export const updateStudent = (id, data) =>
  axiosInstance.put(`/students/${id}`, data);

// dropdowns
export const getCourses = () => axiosInstance.get("/api/courses");
export const getBatches = () => axiosInstance.get("/batchcycle/getall");
export const getGroups = () => axiosInstance.get("/coursegroup");
