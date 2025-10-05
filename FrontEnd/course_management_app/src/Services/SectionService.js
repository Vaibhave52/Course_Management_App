import axiosInstance from "./axiosInstance";

// ---------- Sections ----------
export const getSectionsBySubject = async (subjectId) => {
  try {
    const res = await axiosInstance.get(`/section/${subjectId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch sections:", err);
    throw err;
  }
};

export const addSection = async (subjectId, data) => {
  try {
    const res = await axiosInstance.post("/section/add", {
      ...data,
      subjectId,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to add section:", err);
    throw err;
  }
};

export const updateSection = async (id, data) => {
  try {
    const res = await axiosInstance.put(`/section/update/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to update section:", err);
    throw err;
  }
};

export const deleteSection = async (id) => {
  try {
    const res = await axiosInstance.delete(`/section/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete section:", err);
    throw err;
  }
};
