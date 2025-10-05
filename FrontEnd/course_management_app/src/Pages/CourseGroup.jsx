import { useEffect, useState } from "react";
import {
  addGroup,
  deleteGroup,
  getCourses,
  getGroups,
  updateGroup,
} from "../Services/CourseGroup";
import { toast } from "react-toastify";

function CourseGroup() {
  const [groups, setGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState(""); // filter state

  const [formData, setFormData] = useState({
    id: null,
    groupName: "",
    description: "",
    courseId: "",
  });

  // Fetch groups and courses on mount
  useEffect(() => {
    fetchGroups();
    fetchCourses();
  }, []);

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const res = await getGroups();
      setGroups(res.data); // API returns GroupRespDto list
    } catch (err) {
      toast.error("Failed to fetch groups. Server may be down");
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data); // API returns Course list with id & name
    } catch (err) {
      toast.error("Failed to fetch courses. Server may be down");
    }
  };

  // Open Add Group modal
  const handleAdd = () => {
    setFormData({ id: null, groupName: "", description: "", courseId: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Open Edit Group modal
  const handleEdit = (group) => {
    setFormData({
      id: group.id,
      groupName: group.groupName,
      description: group.description,
      courseId: group.courseId.toString(), // use courseId from DTO
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // Delete a group
  const handleDeleteGroup = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this group?")) {
        const response = await deleteGroup(id);
        console.log(response.data);
        console.log(response.status);
        if (response.status === "OK") {
          toast.success("Group deleted successfully!");
          fetchGroups();
        }
      }
    } catch (err) {
      toast.error("Failed to delete group.Server Error");
    }
  };

  // Submit Add/Edit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }

    try {
      if (isEdit) {
        const response = await updateGroup(formData.id, formData);
        if (response?.status === 200) {
          toast.success("Group updated successfully!");
        }
      } else {
        const response = await addGroup(formData);
        if (response?.status === 201) {
          toast.success("Group added successfully!");
        }
      }
      setIsModalOpen(false);
      fetchGroups();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save group.Server Error");
    }
  };

  // Filter groups by selected courseId
  const filteredGroups = selectedCourseFilter
    ? groups.filter((g) => g.courseId.toString() === selectedCourseFilter)
    : groups;

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="mb-4 flex justify-between items-center">
          <button
            className="bg-green-400 text-white px-4 py-1 rounded hover:bg-green-600 transition"
            onClick={handleAdd}
          >
            + Add Group
          </button>

          {/* Filter by course */}
          <select
            className="border border-gray-300 px-3 py-2 mr rounded"
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Groups Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2 w-12 text-left">#</th>
                <th className="px-4  py-2 w-1/6 text-left">Title</th>
                <th className="px-4 py-2 w-1/4 text-left">Description</th>
                <th className="px-4 py-2 w-1/3 text-left">Courses</th>
                <th className="px-4 py-2 w-1/6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map((g, index) => (
                  <tr
                    key={g.id}
                    className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{g.groupName}</td>
                    <td className="px-4 py-2">{g.description}</td>
                    <td className="px-4 py-2">{g.courseName}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(g)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No groups found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit Group" : "Add Group"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.groupName}
                  onChange={(e) =>
                    setFormData({ ...formData, groupName: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Course</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2  rounded "
                  value={formData.courseId}
                  onChange={(e) =>
                    setFormData({ ...formData, courseId: e.target.value })
                  }
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-300 text-black px-4 py-1 rounded hover:bg-blue-400"
                >
                  {isEdit ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CourseGroup;
