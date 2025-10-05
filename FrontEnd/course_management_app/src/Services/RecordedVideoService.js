import axiosInstance from "./axiosInstance";

// Helper to handle errors
const handleError = (err, action) => {
  console.error(`Failed to ${action}:`, err);
};

// Get all videos
export const getVideos = async () => {
  try {
    const res = await axiosInstance.get("/api/recorded-videos");
    return res.data;
  } catch (err) {
    handleError(err, "fetch videos");
    return [];
  }
};

// Add new video
export const addVideo = async (video) => {
  try {
    const res = await axiosInstance.post("/api/recorded-videos", video);
    return res.data;
  } catch (err) {
    handleError(err, "add video");
  }
};

// Update video
export const updateVideo = async (id, video) => {
  try {
    const res = await axiosInstance.put(`/api/recorded-videos/${id}`, video);
    return res.data;
  } catch (err) {
    handleError(err, `update video with id ${id}`);
  }
};

// Delete video
export const deleteVideo = async (id) => {
  try {
    const res = await axiosInstance.delete(`/api/recorded-videos/${id}`);

    return res.data;
  } catch (err) {
    handleError(err, `delete video with id ${id}`);
  }
};

// Get all course modules
export const getCourseModules = async () => {
  try {
    const res = await axiosInstance.get("/api/course-modules");
    return res.data;
  } catch (err) {
    handleError(err, "fetch course modules");
    return [];
  }
};
