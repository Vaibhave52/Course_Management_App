import React, { useEffect, useState } from "react";
import { getAllStudents, deleteStudent } from "../Services/StudentService.js";
import { getAllCourses } from "../Services/CourseService.js";
import StudentForm from "./StudentForm.jsx";
import { toast } from "react-toastify";

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  // ✅ Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      const data = res.data || res;
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to fetch students");
    }
  };

  // ✅ Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      setCourses(res.data || res);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // ✅ Auto filter when course changes
  useEffect(() => {
    if (!selectedCourse) {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((s) => s.courseName === selectedCourse);
      setFilteredStudents(filtered);
    }
  }, [selectedCourse, students]);

  // ✅ Reset filter
  const handleReset = () => {
    setSelectedCourse("");
    setFilteredStudents(students);
  };

  // ✅ Delete student
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await deleteStudent(id);
        toast.success("Student deleted successfully!");
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err);
        toast.error("Failed to delete student");
      }
    }
  };

  // ✅ Open edit form
  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {/* ✅ Left side: Course Filter + Reset */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* ✅ Right side: Add Student */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Reg No</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Mobile</th>
            <th className="border px-3 py-2">Course</th>
            <th className="border px-3 py-2">Batch</th>
            <th className="border px-3 py-2">Group</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s, index) => (
            <tr key={s.id}>
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{s.registrationNo}</td>
              <td className="border px-3 py-2">{s.name}</td>
              <td className="border px-3 py-2">{s.email}</td>
              <td className="border px-3 py-2">{s.mobileNo}</td>
              <td className="border px-3 py-2">{s.courseName}</td>
              <td className="border px-3 py-2">{s.batchName}</td>
              <td className="border px-3 py-2">{s.groupName}</td>
              <td className="border px-3 py-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup Form */}
      {showForm && (
        <StudentForm
          existingStudent={editingStudent}
          onClose={() => setShowForm(false)}
          onSuccess={fetchStudents}
        />
      )}
    </div>
  );
}

export default StudentPage;
