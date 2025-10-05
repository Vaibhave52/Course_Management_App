import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../Services/AuthContext";
import axiosInstance from "../Services/axiosInstance";

export default function Login() {
  // ---------------- States ----------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPasswordRef = useRef(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ---------------- Validation ----------------
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // ---------------- Focus New Password on Modal Open ----------------
  useEffect(() => {
    if (forgotOpen) {
      newPasswordRef.current?.focus();
    }
  }, [forgotOpen]);

  // ---------------- Login Handler ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    if (!validateEmail(email)) return toast.error("Enter a valid email");
    if (!password) return toast.error("Password is required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      const response = await axiosInstance.post(`/login`, { email, password });
      const { token, role, name } = response.data;

      console.log(response.data);

      login({ token, email, role, name });
      toast.success("Login successful!");

      if (role === "ADMIN") navigate("/batch-cycle");
      else if (role === "COORDINATOR") navigate("/modules");
      else navigate("/unauthorized");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        toast.error("Network error. Please check your backend server.");
      } else if (error.code === "ERR_BAD_RESPONSE") {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.error("Something went wrong. Try again later.");
      }
      console.error("Login error:", error);
    }
  };

  // ---------------- Forgot Password Handler ----------------
  const handleResetPassword = async () => {
    if (!forgotEmail) return toast.error("Email is required");
    if (!validateEmail(forgotEmail)) return toast.error("Enter a valid email");
    if (!newPassword) return toast.error("New password is required");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match!");
    console.log("Reset email:", forgotEmail, "New password:", newPassword);

    try {
      await axiosInstance.post("/login/forgot-password", {
        email: forgotEmail,
        newPassword,
      });

      console.log("Reset email:", forgotEmail, "New password:", newPassword);

      toast.success("Password reset successfully!");
      // Reset modal state
      setForgotOpen(false);
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (err) {
      toast.error(err.response?.data || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* ---------------- Login Form ---------------- */}
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-2xl rounded-2xl p-10 w-[420px]"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-violet-700">
          Login
        </h2>

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-5 p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
        />

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-violet-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Remember me + Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-violet-600 border-gray-300 rounded"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-sm text-violet-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg text-lg font-medium"
        >
          Login
        </button>
      </form>

      {/* ---------------- Forgot Password Modal ---------------- */}
      {forgotOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-xl relative">
            <h3 className="text-xl font-semibold text-violet-700 mb-4">
              Reset Password
            </h3>

            {/* Email */}
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none mb-3"
            />

            {/* New Password */}
            <div className="relative mb-3">
              <input
                type={showNewPassword ? "text" : "password"}
                ref={newPasswordRef}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-violet-600"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-4">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-violet-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-violet-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setForgotOpen(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
