import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllBatchCycles,
  addBatchCycle,
  updateBatchCycle,
  deleteBatchCycle,
} from "../Services/BatchCycle";

function BatchCyclePage() {
  const [batchCycles, setBatchCycles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Fetch all batch cycles
  useEffect(() => {
    fetchBatchCycles();
  }, []);

  const fetchBatchCycles = async () => {
    try {
      const res = await getAllBatchCycles();
      setBatchCycles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to fetch batch cycles. Server may be down.");
    }
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (batch) => {
    setFormData({
      id: batch.id,
      name: batch.name,
      description: batch.description,
      startDate: batch.startDate ? batch.startDate.slice(0, 16) : "",
      endDate: batch.endDate ? batch.endDate.slice(0, 16) : "",
      isActive: batch.isActive,
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch cycle?"))
      return;
    try {
      await deleteBatchCycle(id);
      toast.success("Batch cycle deleted successfully!");
      fetchBatchCycles();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Cannot delete batch cycle. Server error.";
      toast.error(msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, description, startDate, endDate, isActive } = formData;

    if (!name || !description || !startDate || !endDate) {
      toast.warn("All fields are required!");
      return;
    }

    try {
      if (isEdit) {
        await updateBatchCycle(id, formData);
        toast.success("Batch cycle updated successfully!");
      } else {
        await addBatchCycle(formData);
        toast.success("Batch cycle added successfully!");
      }
      setIsModalOpen(false);
      fetchBatchCycles();
    } catch (err) {
      toast.error("Server error. Could not save batch cycle.");
    }
  };

  return (
    <div className="w-full h-full p-6">
      <div className="flex justify-between items-center mb-3">
        <button
          className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-600 transition"
          onClick={handleAdd}
        >
          + Add Batch Cycle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batchCycles.length > 0 ? (
              batchCycles.map((batch, index) => (
                <tr
                  key={batch.id}
                  className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{batch.name}</td>
                  <td className="px-4 py-2">{batch.description}</td>
                  <td className="px-4 py-2">
                    {batch.startDate
                      ? new Date(batch.startDate).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-2">
                    {batch.endDate
                      ? new Date(batch.endDate).toLocaleString()
                      : ""}
                  </td>
                  <td className="px-4 py-2">{batch.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(batch)}
                      className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(batch.id)}
                      className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No batch cycles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {isEdit ? "Edit Batch Cycle" : "Add Batch Cycle"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
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
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                <label className="text-gray-700">Active</label>
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
    </div>
  );
}

export default BatchCyclePage;
