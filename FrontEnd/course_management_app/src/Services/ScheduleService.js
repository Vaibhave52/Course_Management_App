import axiosInstance from "./axiosInstance";

// ---------- Schedules ----------
export const getSchedules = () => axiosInstance.get("/api/schedules");

export const getSchedule = (id) => axiosInstance.get(`/api/schedules/${id}`);

export const addSchedule = (schedule) =>
  axiosInstance.post("/api/schedules", schedule);

export const updateSchedule = (id, schedule) =>
  axiosInstance.put(`/api/schedules/${id}`, schedule);

export const deleteSchedule = (id) =>
  axiosInstance.delete(`/api/schedules/${id}`);

export const generateScheduleReport = (start, end) =>
  axiosInstance.get("/api/schedules/report", { params: { start, end } });

// ---------- Dropdowns ----------
export const getModules = () => axiosInstance.get("/api/course-modules");

export const getInfrastructures = () => axiosInstance.get("/infrastructure");

export const getGroups = () => axiosInstance.get("/coursegroup");

export const getStaff = () => axiosInstance.get("/staff/getall");

// ---------- Fetch all dropdowns ----------
export const fetchAllDropdowns = async () => {
  const [modulesRes, infraRes, groupsRes, staffRes] = await Promise.all([
    getModules(),
    getInfrastructures(),
    getGroups(),
    getStaff(),
  ]);

  return {
    modules: modulesRes.data,
    infrastructures: infraRes.data,
    groups: groupsRes.data,
    staff: staffRes.data,
  };
};
