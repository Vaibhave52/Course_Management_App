import axiosInstance from "./axiosInstance";

// ✅ Get all courses
export const getAllCourses = async () => {
  try {
    const res = await axiosInstance.get("/api/courses");
    console.log(res);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

// ✅ Get course by ID
export const getCourseById = async (id) => {
  try {
    const res = await axiosInstance.get(`/api/courses/${id}`);
    console.log(res);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error fetching course by ID:", error);
  }
};

// ✅ Add new course
export const addCourse = async (course) => {
  try {
    const res = await axiosInstance.post("/api/courses", course);
    console.log(res);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error adding course:", error);
  }
};

// ✅ Update course
export const updateCourse = async (id, course) => {
  try {
    const res = await axiosInstance.put(`/api/courses/${id}`, course);
    console.log(res);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error updating course:", error);
  }
};

// ✅ Delete course
export const deleteCourse = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/courses/${id}`);
    console.log(res);
    console.log(res.data);
    return res;
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

// ✅ Dropdowns
export const getBatchCycles = () => axiosInstance.get("/batchcycle/getall");
export const getCourseTypes = () => axiosInstance.get("/coursetype");
export const getPremises = () => axiosInstance.get("/premises/getall");
export const getStaff = () => axiosInstance.get("/staff/getall");

// ✅ Fetch all dropdowns in one call
export const fetchAllDropdowns = async () => {
  try {
    const [batchRes, typeRes, premRes, staffRes] = await Promise.all([
      getBatchCycles(),
      getCourseTypes(),
      getPremises(),
      getStaff(),
    ]);

    return {
      batchCycles: batchRes.data.map((b) => ({ id: b.id, title: b.name })),
      courseTypes: typeRes.data.map((c) => ({ id: c.id, title: c.title })),
      premises: premRes.data.map((p) => ({ id: p.id, name: p.instituteName })),
      staff: staffRes.data
      .filter((s) => s)
      .map((s) => ({ id: s.id, name: s.name })),
    };
  } catch (error) {
    console.error("Error fetching dropdowns", error);
    throw error;
  }
};
