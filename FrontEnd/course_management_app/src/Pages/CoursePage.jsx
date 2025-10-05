import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getAllCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  fetchAllDropdowns,
} from "../Services/CourseService";

export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");


  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    batchCycleId: "",
    courseTypeId: "",
    premisesId: [],
    staffId: "",
  });

  // Dropdown states
  const [batchCycles, setBatchCycles] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [premises, setPremises] = useState([]);
  const [staff, setStaff] = useState([]);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await getAllCourses();
      if (res?.data) {
        setCourses(res.data);
        setFilteredCourses(res.data);
      }
    } catch (error) {
      console.error("Error fetching courses", error);
      toast.error("Failed to load courses");
    }
  };

  // Fetch all dropdowns in one call
  const fetchDropdowns = async () => {
    try {
      const { batchCycles, courseTypes, premises, staff } = await fetchAllDropdowns();
      setBatchCycles(batchCycles);
      setCourseTypes(courseTypes);
      setPremises(premises);
      setStaff(staff);
    } catch (error) {
      toast.error("Failed to load dropdowns");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchDropdowns();
  }, []);

   // 🔹 Apply filters whenever state changes
   useEffect(() => {
    let data = [...courses];

    // Status filter (assuming your API sends c.status = "Active" / "Closed")
    if (statusFilter !== "all") {
      data = data.filter((c) => c.status === statusFilter);
    }

    // Search by course name/title
    if (searchTerm.trim() !== "") {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter (assumes c.courseTypeName exists)
    if (typeFilter !== "all") {
      data = data.filter((c) => c.courseTypeName === typeFilter);
    }

    setFilteredCourses(data);
  }, [statusFilter, searchTerm, typeFilter, courses]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle premises checkbox
  const handlePremisesCheckbox = (id) => {
    let updated = [...form.premisesId];
    if (updated.includes(id)) {
      updated = updated.filter((i) => i !== id);
    } else {
      updated.push(id);
    }
    setForm({ ...form, premisesId: updated });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, form);
        toast.success("Course updated successfully!");
      } else {
        await addCourse(form);
        toast.success("Course added successfully!");
      }
      setShowForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error("Error saving course", error);
      toast.error("Error saving course!");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course", error);
      toast.error("Failed to delete course!");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingCourse(null);
            setForm({
              name: "",
              description: "",
              startDate: "",
              endDate: "",
              batchCycleId: "",
              courseTypeId: "",
              premisesId: [],
              coordinatorId: "",   // ✅ use this

            });
          }}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Course
        </button>
      </div>

      {/* 🔹 Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All</option>
          <option value="Active">Active</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All types</option>
          {[...new Set(courses.map((c) => c.courseTypeName))].map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Table */}
      <table className="w-full border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Batch Cycle</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">End Date</th>
            <th className="p-2 border">Students</th>
            <th className="p-2 border">Staff</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((c, index) => (
            <tr key={c.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.batchCycleTitle}</td>
                <td className="p-2 border">{c.premisesName?.join(", ")}</td>
                <td className="p-2 border">{c.courseTypeName}</td>
                <td className="p-2 border">{c.startDate}</td>
                <td className="p-2 border">{c.endDate}</td>
                <td className="p-2 border">{c.studentCount}</td>
                <td className="p-2 border">{c.staffName || "No Coordinator Assigned"}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingCourse(c);
                      setForm({
                        name: c.name || "",
                        description: c.description || "",
                        startDate: c.startDate || "",
                        endDate: c.endDate || "",
                        batchCycleId: c.batchCycleId?.toString() || "",
                        courseTypeId: c.courseTypeId?.toString() || "",
                        premisesId: c.premisesId || [],
                        coordinatorId: c.coordinatorId || "",  // ✅
                      });
                    }}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 Add/Edit Form inside Page */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[500px]">
            <h2 className="text-xl font-semibold mb-4">
              {editingCourse ? "Edit Course" : "Add Course"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Course Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />

              <div className="flex gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="border rounded p-2 w-1/2"
                  required
                />
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="border rounded p-2 w-1/2"
                  required
                />
              </div>

              {/* BatchCycle Dropdown */}
              <select
                name="batchCycleId"
                value={form.batchCycleId}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Batch Cycle</option>
                {batchCycles.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>

              {/* CourseType Dropdown */}
              <select
                name="courseTypeId"
                value={form.courseTypeId}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Course Type</option>
                {courseTypes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              {/* Premises Checkboxes */}
              <div className="border p-2 rounded max-h-40 overflow-y-auto">
                <label className="font-semibold mb-1 block">Select Premises:</label>
                {premises.map((p) => (
                  <label key={p.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.premisesId.includes(p.id)}
                      onChange={() => handlePremisesCheckbox(p.id)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>

              {/* Staff Dropdown */}
              <select
                name="staffId"
                value={form.staffId}
                onChange={(e) =>
                  setForm({ ...form, coordinatorId: parseInt(e.target.value) })
                }
                className="w-full border rounded p-2"
                required
              >
                <option value="">Select Course Coordinator</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingCourse(null);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingCourse ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


