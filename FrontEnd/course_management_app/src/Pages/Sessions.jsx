import { useEffect, useState } from "react";
import {
  addSession,
  deleteSession,
  getAllModules,
  getSessions,
  updateSession,
} from "../Services/Sessions";
import { toast } from "react-toastify";

export default function Sessions() {
  const [sessions, setSessions] = useState([]);

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterActive, setFilterActive] = useState("");

  // Modules
  const [modules, setModules] = useState([]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    codeShareToken: "",
    sessionDate: "",
    startTime: "",
    endTime: "",
    zoomMeetingId: "",
    zoomMeetingPassword: "",
    description: "",
    courseModuleId: "",
  });

  // Fetch modules
  const fetchModules = async () => {
    try {
      const res = await getAllModules();
      console.log(res);
      console.log(res.data);
      setModules(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Failed to fetch modules.Server May be down");
    }
  };

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      const filters = {
        date: filterDate || undefined,
        moduleId: filterModule || undefined,
        active:
          filterActive === "true"
            ? true
            : filterActive === "false"
            ? false
            : undefined,
      };

      const res = await getSessions(filters);
      console.log(res);
      setSessions(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Failed to fetch sessions.Server May be down");
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [filterDate, filterModule, filterActive]);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal
  const openAddModal = () => {
    setEditingSession(null);
    setFormData({
      title: "",
      codeShareToken: "",
      sessionDate: "",
      startTime: "",
      endTime: "",
      zoomMeetingId: "",
      zoomMeetingPassword: "",
      description: "",
      courseModuleId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      codeShareToken: session.codeShareToken,
      sessionDate: session.sessionDate,
      startTime: session.startTime,
      endTime: session.endTime,
      zoomMeetingId: session.zoomMeetingId,
      zoomMeetingPassword: session.zoomMeetingPassword,
      description: session.description,
      courseModuleId: session.courseModuleId || "",
    });
    setIsModalOpen(true);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        const res = await updateSession(editingSession.id, formData);
        console.log(res.data);
        if (res.status === 200) {
          toast.success("Session updated successfully");
        }
      } else {
        const res = await addSession(formData);
        console.log(res.data);
        if (res.status === 201) {
          toast.success("Session added successfully");
        }
      }
      setIsModalOpen(false);
      fetchSessions();
    } catch (error) {
      console.log(error);
      toast.error("Error saving session.Server Error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;
    try {
      const res = await deleteSession(id);
      console.log(res.status);
      if (res["status"] == 200) {
        toast.success("Session deleted successfully");
      }
      fetchSessions();
    } catch (error) {
      toast.error("Failed to delete session.Server Error");
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        {/* Date filter */}
        <input
          type="date"
          className="border p-2 rounded"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        {/* Module filter */}
        <select
          className="border p-2 rounded"
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
        >
          <option value="">All Modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        {/* Active dropdown filter */}
        <select
          className="border p-2 rounded"
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Reset Button */}
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => {
            setFilterDate("");
            setFilterModule("");
            setFilterActive("");
            fetchSessions();
          }}
        >
          Reset
        </button>

        <button
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openAddModal}
        >
          Add Session
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Code Share Token</th>
              <th className="px-3 py-2 text-left">Meeting ID</th>
              <th className="px-3 py-2 text-left">Meeting Password</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length > 0 ? (
              sessions.map((session, index) => (
                <tr
                  key={session.id}
                  className="border-t hover:bg-gray-100 transition-colors text-sm sm:text-base"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{session.title}</td>
                  <td className="px-3 py-2">
                    {new Date(session.sessionDate).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-3 py-2">
                    {session.startTime.slice(0, 5)} -{" "}
                    {session.endTime.slice(0, 5)}
                  </td>
                  <td className="px-3 py-2">{session.codeShareToken}</td>
                  <td className="px-3 py-2">{session.zoomMeetingId}</td>
                  <td className="px-3 py-2">{session.zoomMeetingPassword}</td>
                  <td className="px-3 py-2 text-center space-x-2">
                    <button
                      onClick={() => openEditModal(session)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingSession ? "Edit Session" : "Add Session"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="date"
                name="sessionDate"
                value={formData.sessionDate}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <div className="flex gap-2">
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-1/2"
                  required
                />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-1/2"
                  required
                />
              </div>
              <input
                type="text"
                name="codeShareToken"
                placeholder="Code Share Token"
                value={formData.codeShareToken}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="zoomMeetingId"
                placeholder="Zoom Meeting ID"
                value={formData.zoomMeetingId}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="zoomMeetingPassword"
                placeholder="Zoom Meeting Password"
                value={formData.zoomMeetingPassword}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />

              <select
                name="courseModuleId"
                value={formData.courseModuleId}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Module</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editingSession ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
