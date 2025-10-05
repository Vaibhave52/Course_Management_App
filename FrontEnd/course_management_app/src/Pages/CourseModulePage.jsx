// import React, { useEffect, useState } from "react";
// import {
//   getModules,
//   addModule,
//   updateModule,
//   deleteModule,
//   getCourses,
//   getStaff,
// } from "../Services/CourseModuleService";
// import { toast } from "react-toastify";

// function CourseModulePage() {
//   const [modules, setModules] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [staffList, setStaffList] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     courseId: "",
//     theoryHours: "",
//     practicalHours: "",
//     staffId: "",
//   });

//   // Load initial data
//   useEffect(() => {
//     loadModules();
//     loadCourses();
//     loadStaff();
//   }, []);

//   const loadModules = async () => {
//     try {
//       const data = await getModules();
//       setModules(data);
//     } catch {
//       toast.error("Failed to load modules");
//     }
//   };

//   const loadCourses = async () => {
//     try {
//       const data = await getCourses();
//       setCourses(data);
//     } catch {
//       toast.error("Failed to load courses");
//     }
//   };

//   const loadStaff = async () => {
//     try {
//       const data = await getStaff();
//       setStaffList(data);
//     } catch {
//       toast.error("Failed to load staff");
//     }
//   };

//   // Form input handler
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // Save / Update module
//   const handleSave = async () => {
//     try {
//       if (!formData.courseId || !formData.staffId) {
//         toast.error("Please select a course and staff!");
//         return;
//       }

//       if (isEditing) {
//         await updateModule(editId, formData);
//         toast.success("Module updated successfully!");
//       } else {
//         await addModule(formData);
//         toast.success("Module added successfully!");
//       }
//       await loadModules();
//       resetForm();
//       setShowForm(false); // ✅ close after save
//     } catch {
//       toast.error("Failed to save module");
//     }
//   };

//   // Edit module
//   const handleEdit = (module) => {
//     setFormData({
//       title: module.title,
//       description: module.description,
//       courseId: module.courseIds?.[0] ?? "",
//       theoryHours: module.theoryHours,
//       practicalHours: module.practicalHours,
//       staffId: module.staffId ?? module.staff?.id ?? "",
//     });
//     setEditId(module.id);
//     setIsEditing(true);
//     setShowForm(true);
//   };

//   // Delete module
//   const handleDelete = async (id) => {
//     try {
//       await deleteModule(id);
//       toast.success("Module deleted successfully!");
//       loadModules();
//     } catch {
//       toast.error("Failed to delete module");
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       title: "",
//       description: "",
//       courseId: "",
//       theoryHours: "",
//       practicalHours: "",
//       staffId: "",
//     });
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <div className="p-6">
//       {/* Header + Add Button */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-bold">Course Modules</h2>
//         <button
//           onClick={() => {
//             resetForm();
//             setShowForm(true); // ✅ show popup
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           + Add Module
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto border rounded">
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border">#</th>
//               <th className="p-2 border">Title</th>
//               <th className="p-2 border">Description</th>
//               <th className="p-2 border">Theory</th>
//               <th className="p-2 border">Practical</th>
//               <th className="p-2 border">Course(s)</th>
//               <th className="p-2 border">Staff</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {modules.map((m, index) => (
//               <tr key={m.id} className="text-center">
//                 <td className="p-2 border">{index + 1}</td>
//                 <td className="p-2 border">{m.title}</td>
//                 <td className="p-2 border">{m.description}</td>
//                 <td className="p-2 border">{m.theoryHours}</td>
//                 <td className="p-2 border">{m.practicalHours}</td>
//                 <td className="p-2 border">
//                   {m.courseNames && m.courseNames.length > 0
//                     ? m.courseNames.join(", ")
//                     : "No Course"}
//                 </td>
//                 <td className="p-2 border">
//                   {m.staffName ?? m.staff?.name ?? m.staffId}
//                 </td>
//                 <td className="p-2 border space-x-2">
//                   <button
//                     onClick={() => handleEdit(m)}
//                     className="bg-green-500 text-white px-2 py-1 rounded-md"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(m.id)}
//                     className="bg-red-600 text-white px-2 py-1 rounded-md"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popup Form */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-1/3">
//             <h3 className="text-lg font-bold mb-4">
//               {isEditing ? "Edit Module" : "Add Module"}
//             </h3>

//             <input
//               name="title"
//               placeholder="Title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2"
//             />
//             <input
//               name="description"
//               placeholder="Description"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2"
//             />

//             <select
//               name="courseId"
//               value={formData.courseId}
//               onChange={(e) =>
//                 setFormData({ ...formData, courseId: Number(e.target.value) })
//               }
//               className="w-full border p-2 mb-2"
//             >
//               <option value="">-- Select Course --</option>
//               {courses.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>

//             <input
//               name="theoryHours"
//               placeholder="Theory Hours"
//               value={formData.theoryHours}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2"
//             />
//             <input
//               name="practicalHours"
//               placeholder="Practical Hours"
//               value={formData.practicalHours}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2"
//             />

//             <select
//               name="staffId"
//               value={formData.staffId}
//               onChange={(e) =>
//                 setFormData({ ...formData, staffId: Number(e.target.value) })
//               }
//               className="w-full border p-2 mb-4"
//             >
//               <option value="">-- Select Staff --</option>
//               {staffList.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="bg-gray-400 text-white px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="bg-green-600 text-white px-4 py-2 rounded-md"
//               >
//                 {isEditing ? "Update" : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default CourseModulePage;
import React, { useEffect, useState } from "react";
import {
  getModules,
  addModule,
  updateModule,
  deleteModule,
  getCourses,
  getStaff,
} from "../Services/CourseModuleService";
import { toast } from "react-toastify";

function CourseModulePage() {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [filterCourseId, setFilterCourseId] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    theoryHours: "",
    practicalHours: "",
    staffId: "",
  });

  // Load initial data
  useEffect(() => {
    loadModules();
    loadCourses();
    loadStaff();
  }, []);

  const loadModules = async () => {
    try {
      const data = await getModules();
      setModules(data);
      setFilteredModules(data); // Initially, show all
    } catch {
      toast.error("Failed to load modules");
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch {
      toast.error("Failed to load courses");
    }
  };

  const loadStaff = async () => {
    try {
      const data = await getStaff();
      setStaffList(data);
    } catch {
      toast.error("Failed to load staff");
    }
  };

  // Form input handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Save / Update module
  const handleSave = async () => {
    try {
      if (!formData.courseId || !formData.staffId) {
        toast.error("Please select a course and staff!");
        return;
      }

      if (isEditing) {
        await updateModule(editId, formData);
        toast.success("Module updated successfully!");
      } else {
        await addModule(formData);
        toast.success("Module added successfully!");
      }
      await loadModules();
      resetForm();
      setShowForm(false);
    } catch {
      toast.error("Failed to save module");
    }
  };

  // Edit module
  const handleEdit = (module) => {
    setFormData({
      title: module.title,
      description: module.description,
      courseId: module.courseIds?.[0] ?? "",
      theoryHours: module.theoryHours,
      practicalHours: module.practicalHours,
      staffId: module.staffId ?? module.staff?.id ?? "",
    });
    setEditId(module.id);
    setIsEditing(true);
    setShowForm(true);
  };

  // Delete module
  const handleDelete = async (id) => {
    try {
      await deleteModule(id);
      toast.success("Module deleted successfully!");
      loadModules();
    } catch {
      toast.error("Failed to delete module");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseId: "",
      theoryHours: "",
      practicalHours: "",
      staffId: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Filter modules by course
  const handleFilterChange = (e) => {
    const courseId = e.target.value;
    setFilterCourseId(courseId);
    if (!courseId) {
      setFilteredModules(modules);
    } else {
      const filtered = modules.filter((m) =>
        m.courseIds?.includes(Number(courseId))
      );
      setFilteredModules(filtered);
    }
  };

  // Reset filter
  const handleResetFilter = () => {
    setFilterCourseId("");
    setFilteredModules(modules);
  };

  return (
    <div className="p-6">
      {/* Header + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center mb-4 space-x-2">
          <select
            value={filterCourseId}
            onChange={handleFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleResetFilter}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Module
        </button>
      </div>

      {/* Filter Dropdown */}

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Theory</th>
              <th className="p-2 border">Practical</th>
              <th className="p-2 border">Courses</th>
              <th className="p-2 border">Module Router</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((m, index) => (
              <tr key={m.id} className="text-center">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{m.title}</td>
                <td className="p-2 border">{m.description}</td>
                <td className="p-2 border">{m.theoryHours}</td>
                <td className="p-2 border">{m.practicalHours}</td>
                <td className="p-2 border">
                  {m.courseNames && m.courseNames.length > 0
                    ? m.courseNames.join(", ")
                    : "No Course"}
                </td>
                <td className="p-2 border">
                  {m.staffName ?? m.staff?.name ?? m.staffId}
                </td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredModules.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  No modules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-1/3">
            <h3 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Module" : "Add Module"}
            </h3>

            <input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <select
              name="courseId"
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: Number(e.target.value) })
              }
              className="w-full border p-2 mb-2"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              name="theoryHours"
              placeholder="Theory Hours"
              value={formData.theoryHours}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />
            <input
              name="practicalHours"
              placeholder="Practical Hours"
              value={formData.practicalHours}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <select
              name="staffId"
              value={formData.staffId}
              onChange={(e) =>
                setFormData({ ...formData, staffId: Number(e.target.value) })
              }
              className="w-full border p-2 mb-4"
            >
              <option value="">Select Module Router</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseModulePage;
