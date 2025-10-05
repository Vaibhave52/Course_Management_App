import axiosInstance from "./axiosInstance";

// Helper to handle errors
const handleError = (err, action) => {
  console.error(`Failed to ${action}:`, err);
};

// Course Module APIs
export const getModules = async () => {
  try {
    const res = await axiosInstance.get("/api/course-modules");
    return res.data;
  } catch (err) {
    handleError(err, "fetch course modules");
    return [];
  }
};

export const addModule = async (data) => {
  try {
    const res = await axiosInstance.post("/api/course-modules", data);

    return res.data;
  } catch (err) {
    handleError(err, "add course module");
  }
};

export const updateModule = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/api/course-modules/${id}`, data);

    return res.data;
  } catch (err) {
    handleError(err, `update course module with id ${id}`);
  }
};

export const deleteModule = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/course-modules/${id}`);

    return res.data;
  } catch (err) {
    handleError(err, `delete course module with id ${id}`);
  }
};

// Dropdown Helpers
export const getCourses = async () => {
  try {
    const res = await axiosInstance.get("/api/courses");
    return res.data;
  } catch (err) {
    handleError(err, "fetch courses");
    return [];
  }
};

export const getStaff = async () => {
  try {
    const res = await axiosInstance.get("/staff/getall");
    return res.data;
  } catch (err) {
    handleError(err, "fetch staff");
    return [];
  }
};
