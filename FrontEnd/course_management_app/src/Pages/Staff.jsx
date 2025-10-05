import { toast } from "react-toastify";
import {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  getAllRoles,
} from "../Services/Staff";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // ✅ show/hide toggle
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    password: "",
    mobileNo: "",
    email: "",
    staffType: "",
    roleID: "",
  });

  const staffTypes = ["INHOUSE", "VISITING"];

  useEffect(() => {
    fetchStaff();
    fetchRoles();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await getAllStaff();
      setStaffList(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch staff");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await getAllRoles();
      setRoles(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to fetch roles");
    }
  };

  const handleAdd = () => {
    setFormData({
      id: null,
      name: "",
      password: "",
      mobileNo: "",
      email: "",
      staffType: "",
      roleID: "",
    });
    setIsEdit(false);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleEdit = (staff) => {
    const role = roles.find((r) => r.name === staff.roleName);
    setFormData({
      id: staff.id,
      name: staff.name,
      password: "",
      mobileNo: staff.mobileNo,
      email: staff.email,
      staffType: staff.staffType,
      roleID: role ? role.id : "",
    });
    setIsEdit(true);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await deleteStaff(id);
      toast.success("Staff deleted successfully!");
      fetchStaff();
    } catch {
      toast.error("Cannot delete staff. Staff is assigned to a course.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, password, mobileNo, email, staffType, roleID } = formData;

    if (!name || (!isEdit && !password) || !mobileNo || !email || !staffType || !roleID) {
      toast.warn("All fields are required!");
      return;
    }

    try {
      if (isEdit) {
        await updateStaff(formData.id, formData);
        toast.success("Staff updated successfully!");
      } else {
        await addStaff(formData);
        toast.success("Staff added successfully!");
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch {
      toast.error("Server error. Could not save staff.");
    }
  };

  return (
    <>
      <div className="w-full h-full p-6">
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <button
              className="bg-green-400 text-white px-3 py-2 rounded hover:bg-green-600 transition"
              onClick={handleAdd}
            >
              + Add Staff
            </button>
          </div>

          {/* Staff Table */}
          <table className="w-full border border-gray-300 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-violet-400 text-white">
                <th className="px-4 py-2">#</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Mobile</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Staff Type</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((staff, index) => (
                  <tr key={staff.id} className="border-t hover:bg-gray-100 transition">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{staff.name}</td>
                    <td className="px-4 py-2">{staff.mobileNo}</td>
                    <td className="px-4 py-2">{staff.email}</td>
                    <td className="px-4 py-2">{staff.staffType}</td>
                    <td className="px-4 py-2">{staff.roleName || "N/A"}</td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id)}
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
                    No staff found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Staff" : "Add Staff"}</h2>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4 relative">
                <label className="block text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={isEdit ? "Leave blank to keep current password" : ""}
                  required={!isEdit} // required for Add
                />
                <button
                  type="button"
                  className="absolute right-2 top-9 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Mobile */}
              <div className="mb-4">
                <label className="block text-gray-700">Mobile No</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {/* Staff Type */}
              <div className="mb-4">
                <label className="block text-gray-700">Staff Type</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.staffType}
                  onChange={(e) => setFormData({ ...formData, staffType: e.target.value })}
                  required
                >
                  <option value="">Select type</option>
                  {staffTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={formData.roleID}
                  onChange={(e) => setFormData({ ...formData, roleID: e.target.value })}
                  required
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
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
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
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

export default Staff;
