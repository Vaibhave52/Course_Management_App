import { toast } from "react-toastify";
import {
  getAllCourseType,
  deleteById,
  addCourseType,
  editCourseType,
} from "../Services/CourseType";
import { useEffect, useState } from "react";

function CourseType() {
  const [courseTypes, setCourseTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchCourseType();
  }, []);

  const fetchCourseType = async () => {
    try {
      const response = await getAllCourseType();
      setCourseTypes(Array.isArray(response.data) ? response.data : []); // ensure array
    } catch (error) {
      console.error("Failed to fetch Course Type:", error);
      toast.error("Failed to fetch Course Type. Server may be down.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Course Type?"))
      return;

    try {
      const response = await deleteById(id);
      if (response.status === "OK") {
        toast.success("Course Type Deleted Successfully");
        fetchCourseType();
      } else {
        toast.error("Failed to delete Course Type");
      }
    } catch (err) {
      toast.error("Server error. Could not delete.");
    }
  };

  const handleEdit = (ct) => {
    setFormData({ id: ct.id, title: ct.title, description: ct.description });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({ id: null, title: "", description: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Custom validation before API call
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      if (isEdit) {
        const response = await editCourseType(formData.id, formData);
        if (response?.status === 200) {
          toast.success("Course Type Updated Successfully");
        } else {
          toast.error("Failed to update Course Type");
        }
      } else {
        const response = await addCourseType(formData);
        if (response?.status === 201) {
          toast.success("Course Type Added Successfully");
        } else {
          toast.error("Failed to add Course Type");
        }
      }
      setIsModalOpen(false);
      fetchCourseType();
    } catch (err) {
      toast.error("Server error. Could not save Course Type.");
    }
  };

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="overflow-x-auto">
          <button
            className="bg-green-400 text-white px-4 py-1 mb-3 rounded hover:bg-green-600 transition"
            onClick={handleAdd}
          >
            + Add Course Type
          </button>

          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2 w-12 text-left">#</th>
                <th className="px-4 py-2 w-1/6 text-left">Title</th>
                <th className="px-4 py-2 w-3/5 text-left">Description</th>
                <th className="px-4 py-2 w-1/6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseTypes.length > 0 ? (
                courseTypes.map((ct, index) => (
                  <tr
                    key={ct.id}
                    className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{ct.title}</td>
                    <td className="px-4 py-2">{ct.description}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(ct)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ct.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No course types found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit Course Type" : "Add Course Type"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  //required
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
                  // required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
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

export default CourseType;
