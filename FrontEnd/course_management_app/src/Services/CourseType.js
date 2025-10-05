import axiosInstance from "./axiosInstance";

// GET all course types
export async function getAllCourseType() {
  try {
    const response = await axiosInstance.get("/coursetype");
    console.log(response.data);
    return response;
  } catch (ex) {
    console.error("Exception in getAllCourseType:", ex);
  }
}

// DELETE course type by ID
export async function deleteById(id) {
  try {
    const response = await axiosInstance.delete(`/coursetype/${id}`);
    console.log(response.data);
    return response.data;
  } catch (ex) {
    console.error("Exception in deleteById:", ex);
  }
}

// ADD course type
export async function addCourseType({ title, description }) {
  try {
    const body = { title, description };
    const response = await axiosInstance.post("/coursetype", body);
    console.log(response.data);
    return response;
  } catch (ex) {
    console.error("Exception in addCourseType:", ex);
  }
}

// GET course type by ID
export async function getCourseTypeById(id) {
  try {
    const response = await axiosInstance.get(`/coursetype/${id}`);
    console.log(response);
    return response;
  } catch (ex) {
    console.error("Exception in getCourseTypeById:", ex);
  }
}

// UPDATE course type
export async function editCourseType(id, { title, description }) {
  try {
    const body = { title, description };
    const response = await axiosInstance.put(`/coursetype/${id}`, body);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Exception in updateCourseType:", error);
  }
}
