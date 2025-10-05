import React, { useState, useEffect } from "react";
import {
  getCourses,
  getBatches,
  getGroups,
  addStudent,
  updateStudent,
} from "../Services/StudentService.js";
import { toast } from "react-toastify";

function StudentForm({ existingStudent, onClose, onSuccess }) {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [groups, setGroups] = useState([]);

  const [formData, setFormData] = useState(
    existingStudent || {
      registrationNo: "",
      name: "",
      email: "",
      mobileNo: "",
      password: "",
      courseId: "",
      batchId: "",
      groupId: "",
    }
  );

  // ✅ Fetch dropdown data
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [courseRes, batchRes, groupRes] = await Promise.all([
          getCourses(),
          getBatches(),
          getGroups(),
        ]);
        setCourses(courseRes.data);
        setBatches(batchRes.data);
        setGroups(groupRes.data);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
        toast.error("Failed to fetch dropdown data");
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (existingStudent) {
        await updateStudent(existingStudent.id, formData);
        toast.success("Student updated successfully!");
      } else {
        await addStudent(formData);
        toast.success("Student added successfully!");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving student:", err);
      toast.error("Failed to save student");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          {existingStudent ? "Edit Student" : "Add Student"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="registrationNo"
            placeholder="Registration No"
            value={formData.registrationNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile No"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />

          {/* Course Dropdown */}
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Batch Dropdown */}
          <select
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Group Dropdown */}
          <select
            name="groupId"
            value={formData.groupId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Group</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.groupName}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
