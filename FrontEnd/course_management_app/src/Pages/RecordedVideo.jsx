import React, { useEffect, useState } from "react";
import {
  getVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  getCourseModules,
} from "../Services/RecordedVideoService";
import { toast } from "react-toastify";

function RecordedVideo() {
  const [videos, setVideos] = useState([]);
  const [courseModules, setCourseModules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    videoTitle: "",
    videoUrl: "",
    date: "",
    courseModuleId: "", // ✅ renamed
  });

  // Fetch videos and modules on mount
  useEffect(() => {
    fetchVideos();
    fetchCourseModules();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await getVideos();
      if (Array.isArray(res)) setVideos(res);
      else setVideos([]);
    } catch (err) {
      toast.error("Failed to fetch videos");
      setVideos([]);
    }
  };

  const fetchCourseModules = async () => {
    try {
      const res = await getCourseModules();
      if (Array.isArray(res)) setCourseModules(res);
      else setCourseModules([]);
    } catch (err) {
      toast.error("Failed to fetch course modules");
      setCourseModules([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  const { videoTitle, videoUrl, date, courseModuleId } = formData;

  // 1️⃣ Check required fields
  if (!videoTitle.trim()) {
    toast.error("Video title is required");
    return;
  }
  if (!videoUrl.trim()) {
    toast.error("Video URL is required");
    return;
  }
  if (!date) {
    toast.error("Date is required");
    return;
  }
  if (!courseModuleId) {
    toast.error("Please select a course module");
    return;
  }

  // 2️⃣ Validate URL format
  try {
    new URL(videoUrl);
  } catch {
    toast.error("Please enter a valid URL");
    return;
  }

  

  // ✅ If validation passes, save video
  try {
    let newVideo;
    if (isEditing) {
      newVideo = await updateVideo(editId, formData);
      setVideos((prev) =>
        prev.map((v) => (v.id === editId ? newVideo : v))
      );
      toast.success("Video updated successfully!");
    } else {
      newVideo = await addVideo(formData);
      setVideos((prev) => [...prev, newVideo]);
      toast.success("Video added successfully!");
    }
    resetForm();
  } catch (err) {
    toast.error("Failed to save video");
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteVideo(id);
      toast.success("Video deleted successfully!");
      fetchVideos();
    } catch (err) {
      toast.error("Failed to delete video");
    }
  };

  const handleEdit = (video) => {
    setFormData({
      videoTitle: video.videoTitle,
      videoUrl: video.videoUrl,
      date: video.date,
      courseModuleId: video.courseModuleId, // ✅ renamed
    });
    setEditId(video.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      videoTitle: "",
      videoUrl: "",
      date: "",
      courseModuleId: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recorded Videos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Upload Video
        </button>
      </div>

      {/* Form Popup */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Video" : "Add Recorded Video"}
            </h3>

            <input
              type="text"
              name="videoTitle"
              placeholder="Video Title"
              value={formData.videoTitle}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
              required
            />

            <input
              type="text"
              name="videoUrl"
              placeholder="Video URL"
              value={formData.videoUrl}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />

            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 mb-2 w-full"
            />

            <select
              name="courseModuleId"
              value={formData.courseModuleId}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
              required
            >
              <option value="">Select Course Module</option>
              {courseModules.map((cm) => (
                <option key={cm.id} value={cm.id}>
                  {cm.title}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-full mt-6 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Video URL</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Course Module</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video, index) => (
            <tr key={video.id} className="text-center">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{video.videoTitle}</td>
              <td className="p-2 border">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600"
                >
                  Watch
                </a>
              </td>
              <td className="p-2 border">{video.date}</td>
              <td className="p-2 border">
                {video.courseModuleTitle || video.courseModuleId}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEdit(video)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecordedVideo;
