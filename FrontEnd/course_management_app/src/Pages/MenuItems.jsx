// src/Components/MenuItem.jsx
import React, { useState, useEffect } from "react";
import {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../Services/menuItem";
import { toast } from "react-toastify";

const MenuItem = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    path: "",
  });

  // 🔹 Fetch menu items from backend
  const fetchMenuItems = async () => {
    try {
      const res = await getAllMenuItems();
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to fetch Menu Items. Server may be down.");
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const resetForm = () => {
    setFormData({ title: "", description: "", path: "" });
    setEditId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        path: item.path,
      });
      setEditId(item.id);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.path.trim()) {
      toast.error("Path is required");
      return;
    }

    try {
      if (editId !== null) {
        const res = await updateMenuItem(editId, formData);
        if (res?.status === 200) toast.success("Menu Item Updated Successfully");
        else toast.error("Failed to update Menu Item");
      } else {
        const res = await createMenuItem(formData);
        if (res?.status === 200) toast.success("Menu Item Added Successfully");
        else toast.error("Failed to add Menu Item");
      }
      closeModal();
      fetchMenuItems();
    } catch (error) {
      toast.error("Server error. Could not save Menu Item.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Menu Item?"))
      return;
    try {
      await deleteMenuItem(id);
      toast.success("Menu Item Deleted Successfully");
      fetchMenuItems();
    } catch (error) {
      toast.error("Failed to delete Menu Item");
    }
  };

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="overflow-x-auto">
          <button
            className="bg-green-400 text-white px-4 py-1 mb-3 rounded hover:bg-green-600 transition"
            onClick={() => openModal()}
          >
            + Add Menu Item
          </button>

          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2 w-12 text-left">#</th>
                <th className="px-4 py-2 w-1/6 text-left">Title</th>
                <th className="px-4 py-2 w-2/6 text-left">Description</th>
                <th className="px-4 py-2 w-1/6 text-left">Path</th>
                <th className="px-4 py-2 w-1/6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.title}</td>
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2">{item.path}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-500"
                  >
                    No menu items found
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
              {editId !== null ? "Edit Menu Item" : "Add Menu Item"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Path</label>
                <input
                  type="text"
                  name="path"
                  value={formData.path}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  {editId !== null ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItem;
