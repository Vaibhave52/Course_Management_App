import axiosInstance from "./axiosInstance";

// ---------- Topics ----------
export const getAllTopics = async (sectionId) => {
  try {
    const res = await axiosInstance.get(`/topic/getall/${sectionId}`);
    return res.data || [];
  } catch (err) {
    console.error("Failed to fetch topics:", err);
    throw err;
  }
};

export const addTopic = async (data) => {
  try {
    const res = await axiosInstance.post("/topic/add", data);
    return res.data;
  } catch (err) {
    console.error("Failed to add topic:", err);
    throw err;
  }
};

export const updateTopic = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/topic/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to update topic:", err);
    throw err;
  }
};

export const deleteTopic = async (id) => {
  try {
    const res = await axiosInstance.delete(`/topic/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete topic:", err);
    throw err;
  }
};
