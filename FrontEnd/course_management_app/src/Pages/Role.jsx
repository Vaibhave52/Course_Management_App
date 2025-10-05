import { useState, useEffect } from "react";
import { getAllRoles, createRole, editRole, deleteRole } from "../Services/role";
import { getAllMenuItems } from "../Services/menuItem";
import { toast } from "react-toastify";

function Role() {
  const [roles, setRoles] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    menuitems: [], // store selected menu item IDs
  });

  useEffect(() => {
    fetchRoles();
    fetchMenuItems();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getAllRoles();
      setRoles(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch roles!");
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await getAllMenuItems();
      setMenuItems(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch menu items!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Role?")) return;
    try {
      await deleteRole(id);
      toast.success("Role deleted successfully!");
      fetchRoles();
    } catch {
      toast.error("Failed to delete role!");
    }
  };

  const handleEdit = (role) => {
    setFormData({
      id: role.id,
      name: role.name,
      description: role.description,
      staffMembers: role.staffMembers || [],
      menuitems: role.menuitems ? role.menuitems.map((m) => m.id.toString()) : [],
    });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      menuitems: [],
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Handles the multi-select of menu items
  const handleMenuSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions); // get selected <option> elements
    const selectedIds = selectedOptions.map((option) => parseInt(option.value, 10)); // convert to integers
    setFormData({ ...formData, menuitems: selectedIds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        menuItemIds: formData.menuitems, // send the array of integers (IDs)
      };

      if (isEdit) {
        await editRole(formData.id, payload); // Send to backend
        toast.success("Role updated successfully!");
      } else {
        await createRole(payload); // Send to backend
        toast.success("Role added successfully!");
      }

      setIsModalOpen(false);
      fetchRoles(); // Re-fetch roles after submitting
    } catch (error) {
      toast.error("Server error. Could not save Role.");
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
            + Add Role
          </button>
          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2 w-12 text-left">#</th>
                <th className="px-4 py-2 w-1/6 text-left">Name</th>
                <th className="px-4 py-2 w-3/5 text-left">Description</th>
                <th className="px-4 py-2 w-1/6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role, index) => (
                  <tr
                    key={role.id}
                    className="border-t hover:bg-gray-100 transition text-sm sm:text-base"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{role.name}</td>
                    <td className="px-4 py-2">{role.description}</td>
                   
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(role)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(role.id)}
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
                    colSpan="6"
                    className="text-center p-4 text-gray-500"
                  >
                    No roles found
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
              {isEdit ? "Edit Role" : "Add Role"}
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
                  maxLength="30"
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
                  maxLength="200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Assign Menu Items</label>
                <select
                  multiple
                  value={formData.menuitems}  // array of selected IDs
                  onChange={handleMenuSelect}
                  className="w-full border border-gray-300 px-3 py-2 rounded h-32"
                >
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
                <small className="text-gray-500">
                  Hold down "Ctrl" or "Cmd" to select multiple.
                </small>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default Role;