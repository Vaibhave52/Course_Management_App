import axiosInstance from "./axiosInstance";

// ---------- Subjects ----------
export const getAllSubjects = async () => {
  try {
    const res = await axiosInstance.get("/api/subjects");
    return res.data; // return only data
  } catch (err) {
    console.error("Failed to fetch subjects:", err);
    throw err;
  }
};

export const addSubject = async (data) => {
  return axiosInstance.post("/api/subjects", data);
};

export const updateSubject = async (id, data) => {
  return axiosInstance.put(`/api/subjects/${id}`, data);
};

export const deleteSubject = async (id) => {
  return axiosInstance.delete(`/api/subjects/${id}`);
};

// ---------- Modules ----------
export const getAllModules = async () => {
  try {
    const res = await axiosInstance.get("/api/course-modules");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch modules:", err);
    throw err;
  }
};

// ---------- Sections ----------
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
