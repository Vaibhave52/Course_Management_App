import axiosInstance from "./axiosInstance";

//  Get all groups
export const getGroups = async () => {
  try {
    const response = await axiosInstance.get("/coursegroup");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
};

// Add new group
export const addGroup = async (group) => {
  try {
    const response = await axiosInstance.post("/coursegroup", group);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error adding group:", error);
  }
};

// Update group
export const updateGroup = async (id, group) => {
  try {
    const response = await axiosInstance.put(`/coursegroup/${id}`, group);
    console.log(response.data);
    return response;
  } catch (error) {
    console.error(`Error updating group with id ${id}:`, error);
  }
};

// Delete group
export const deleteGroup = async (id) => {
  try {
    const response = await axiosInstance.delete(`/coursegroup/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error deleting group with id ${id}:`, error);
  }
};

// Get all courses
export const getCourses = async () => {
  try {
    const response = await axiosInstance.get("/api/courses");
    console.log(response.data);
    return response;
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};
