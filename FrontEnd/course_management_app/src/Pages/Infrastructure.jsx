import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  addInfrastructure,
  deleteInfrastructure,
  getAllInfrastructures,
  getAllPremises,
  updateInfrastructure,
} from "../Services/Infrastructure";

function Infrastructure() {
  const [infrastructures, setInfrastructures] = useState([]);
  const [allInfrastructures, setAllInfrastructures] = useState([]); // keep original list
  const [premises, setPremises] = useState([]);
  const [selectedPremises, setSelectedPremises] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    infrastructureType: "",
    premisesId: "",
  });

  //  Fetch infrastructures & premises
  useEffect(() => {
    fetchInfrastructures();
    fetchPremises();
  }, []);

  const fetchInfrastructures = async () => {
    try {
      const res = await getAllInfrastructures();
      const infraList = Array.isArray(res.data) ? res.data : [];
      setAllInfrastructures(infraList);

      //  If filter is applied, re-apply it
      if (selectedPremises) {
        const filtered = infraList.filter(
          (infra) => infra.premisesName === selectedPremises
        );
        setInfrastructures(filtered);
      } else {
        setInfrastructures(infraList);
      }
    } catch (err) {
      toast.error("Failed to fetch infrastructures. Server may be down.");
    }
  };

  const fetchPremises = async () => {
    try {
      const res = await getAllPremises();
      setPremises(
        Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
      );
    } catch (err) {
      toast.error("Failed to fetch premises. Server may be down.");
    }
  };

  //  Premises Filter
  const handlePremisesFilter = (e) => {
    const value = e.target.value;
    setSelectedPremises(value);

    if (!value) {
      setInfrastructures(allInfrastructures);
    } else {
      const filtered = allInfrastructures.filter(
        (infra) => infra.premisesName === value
      );
      setInfrastructures(filtered);
    }
  };

  // Add button
  const handleAdd = () => {
    setFormData({
      id: null,
      title: "",
      description: "",
      infrastructureType: "",
      premisesId: "",
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  //  Edit button
  const handleEdit = (infra) => {
    setFormData({
      id: infra.id,
      title: infra.title,
      description: infra.description,
      infrastructureType: infra.infrastructureType,
      premisesId: infra.premisesId || "",
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  //  Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      const response = await deleteInfrastructure(id);
      if (response.status === 200 || response.status === "OK") {
        toast.success("Infrastructure deleted successfully!");
        fetchInfrastructures();
      } else {
        toast.error("Failed to delete infrastructure");
      }
    } catch (err) {
      toast.error("Server error. Could not delete.");
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, infrastructureType, premisesId } = formData;
    if (!title || !description || !infrastructureType || !premisesId) {
      toast.warn("All fields are required!");
      return;
    }
    try {
      if (isEdit) {
        const response = await updateInfrastructure(formData.id, formData);
        if (response.status === 200) {
          toast.success("Infrastructure updated successfully!");
        }
      } else {
        const response = await addInfrastructure(formData);
        if (response.status === 201) {
          toast.success("Infrastructure added successfully!");
        }
      }
      setIsModalOpen(false);
      fetchInfrastructures();
    } catch (err) {
      toast.error("Server error. Could not Save Infrastructure.");
    }
  };

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            {/* Add Button */}
            <button
              className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-600 transition"
              onClick={handleAdd}
            >
              + Add Infrastructure
            </button>

            <select
              value={selectedPremises}
              onChange={handlePremisesFilter}
              className="border px-3 py-2 rounded shadow-sm"
            >
              <option value="">All Premises</option>
              {premises.map((p) => (
                <option key={p.id} value={p.instituteName}>
                  {p.instituteName}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2 w-12 text-left">#</th>
                <th className="px-3 py-2 w-1/6 text-left">Title</th>
                <th className="px-3 py-2 w-1/6 text-left">Type</th>
                <th className="px-3 py-2 w-1/5 text-left">Description</th>
                <th className="px-3 py-2 w-1 text-left">Premises</th>
                <th className="px-3 py-2 w-1/6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {infrastructures.length > 0 ? (
                infrastructures.map((infra, index) => (
                  <tr
                    key={infra.id}
                    className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{infra.title}</td>
                    <td className="px-4 py-2">{infra.infrastructureType}</td>
                    <td className="px-4 py-2">{infra.description}</td>
                    <td className="px-4 py-2">{infra.premisesName || "N/A"}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(infra)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(infra.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No infrastructures found
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
              {isEdit ? "Edit Infrastructure" : "Add Infrastructure"}
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
                <label className="block text-gray-700">Type</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.infrastructureType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      infrastructureType: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select type</option>
                  <option value="LAB_HALL">Lab Hall</option>
                  <option value="LECTURE_HALL">Lecture Hall</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Premises</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.premisesId}
                  onChange={(e) =>
                    setFormData({ ...formData, premisesId: e.target.value })
                  }
                  required
                >
                  <option value="">Select premises</option>
                  {premises.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.instituteName}
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

export default Infrastructure;
