import React, { useState, useEffect } from "react";
import {
  getallPremises,
  deletePremises,
  editPremises,
  createPremises,
} from "../Services/premises";
import { toast } from "react-toastify";

const Premises = () => {
  const [premisesList, setPremisesList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    instituteName: "",
    address: "",
    description: "",
  });

  // Fetch premises on mount
  useEffect(() => {
    fetchPremises();
  }, []);

  const fetchPremises = async () => {
    try {
      const response = await getallPremises();
      setPremisesList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      toast.error("Failed to fetch premises!");
    }
  };

  const handleAdd = () => {
    setFormData({ id: null, instituteName: "", address: "", description: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (premise) => {
    setFormData({
      id: premise.id,
      instituteName: premise.instituteName,
      address: premise.address,
      description: premise.description,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this premise?")) return;
    try {
      await deletePremises(id);
      toast.success("Premise deleted successfully!");
      fetchPremises();
    } catch (err) {
      toast.error("Failed to delete premise!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.instituteName.trim()) {
      toast.error("Institute Name is required");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      if (isEdit) {
        await editPremises(formData.id, formData);
        toast.success("Premise updated successfully!");
      } else {
        await createPremises(formData);
        toast.success("Premise added successfully!");
      }
      setIsModalOpen(false);
      fetchPremises();
    } catch (err) {
      toast.error("Failed to save premise!");
    }
  };

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="overflow-x-auto">
          <button
            onClick={handleAdd}
            className="bg-green-400 text-white px-4 py-1 mb-3 rounded hover:bg-green-600 transition"
          >
            + Add Premise
          </button>

          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2 w-12 text-left">#</th>
                <th className="px-4 py-2 w-1/4 text-left">Institute Name</th>
                <th className="px-4 py-2 w-1/4 text-left">Address</th>
                <th className="px-4 py-2 w-1/3 text-left">Description</th>
                <th className="px-4 py-2 w-1/6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {premisesList.length > 0 ? (
                premisesList.map((premise, index) => (
                  <tr
                    key={premise.id}
                    className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{premise.instituteName}</td>
                    <td className="px-4 py-2">{premise.address}</td>
                    <td className="px-4 py-2">{premise.description}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(premise)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(premise.id)}
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
                    No premises found
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
              {isEdit ? "Edit Premise" : "Add Premise"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Institute Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.instituteName}
                  onChange={(e) =>
                    setFormData({ ...formData, instituteName: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
};

export default Premises;
