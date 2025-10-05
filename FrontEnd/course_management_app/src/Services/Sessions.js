import axiosInstance from "./axiosInstance";

// SESSIONS
export const getSessions = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/session/filter", { params: filters });
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching sessions:", error);
  }
};

export const addSession = async (session) => {
  try {
    const res = await axiosInstance.post("/session", session);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error adding session:", error);
  }
};

export const updateSession = async (id, session) => {
  try {
    const res = await axiosInstance.put(`/session/${id}`, session);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error updating session:", error);
  }
};

export const deleteSession = async (id) => {
  try {
    const res = await axiosInstance.delete(`/session/${id}`);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error deleting session:", error);
  }
};

// MODULES
export const getAllModules = async () => {
  try {
    const res = await axiosInstance.get("/api/course-modules");
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching modules:", error);
  }
};
