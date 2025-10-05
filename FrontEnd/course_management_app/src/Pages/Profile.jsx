import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Services/axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "../Services/AuthContext";

export default function Profile() {
  const { auth, login, logout } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState({
    id: "",
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    staffType: "",
    roleID: "",
    roleName: "",
  });

  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

  useEffect(() => {
    if (auth?.token) {
      axiosInstance
        .get(`/staff/email/${auth.email}`)
        .then((res) => setStaff(res.data))
        .catch((err) => console.error(err));
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: staff.name,
      email: staff.email,
      mobileNo: staff.mobileNo,
      password: staff.password,
      staffType: staff.staffType,
      roleID: staff.roleID,
    };

    axiosInstance
      .put(`/staff/update/${staff.id}`, payload)
      .then((res) => {
        toast.success("Profile updated successfully!");

        // If email or name is changed => force logout
        if (res.data.email !== auth.email || res.data.name !== auth.name) {
          toast.info("Email/Name changed. Please login again.");
          logout();
        } else {
          // Update auth context so navbar/main reflects changes instantly
          login({
            ...auth,
            name: res.data.name,
            email: res.data.email,
            role: res.data.roleName,
          });

          // Go back to previous page
          navigate(-1);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update profile");
      });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent background */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleCancel} // click outside closes modal
      ></div>

      {/* Modal content */}
      <div className="relative bg-white shadow-xl rounded-2xl p-8 w-full max-w-md z-10">
        <h2 className="text-3xl font-bold text-center text-violet-700 mb-6">
          My Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="name"
            value={staff.name || ""}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none transition"
          />
          <input
            name="email"
            value={staff.email || ""}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none transition"
          />
          <input
            name="mobileNo"
            value={staff.mobileNo || ""}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none transition"
          />

          {/* Password with toggle */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={staff.password || ""}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-violet-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            name="roleName"
            value={staff.roleName || ""}
            disabled
            className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
          />

          {/* Buttons */}
          <div className="flex justify-between mt-4 gap-3">
            <button
              type="submit"
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-medium transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-black py-3 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
