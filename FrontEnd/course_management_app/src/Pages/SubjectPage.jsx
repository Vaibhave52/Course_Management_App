import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as subjectService from "../Services/SubjectService";

export default function SubjectPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [currentSubject, setCurrentSubject] = useState(null);

  // ---------- Form States ----------
  const [subjectForm, setSubjectForm] = useState({ name: "", courseModuleId: "" });
  const [sectionName, setSectionName] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchModules();
  }, []);

  useEffect(() => {
    if (editingSubject) {
      setSubjectForm({
        name: editingSubject.name,
        courseModuleId: editingSubject.courseModuleId || "",
      });
    } else {
      setSubjectForm({ name: "", courseModuleId: "" });
    }
  }, [editingSubject]);

  // ---------- Fetch ----------
  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAllSubjects();
      setSubjects(data || []);
    } catch {
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const data = await subjectService.getAllModules();
      setModules(data || []);
    } catch {
      toast.error("Failed to load modules");
    }
  };

  // ---------- Subject Handlers ----------
  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...subjectForm, courseModuleId: Number(subjectForm.courseModuleId) };
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject.id, data);
        toast.success("Subject updated successfully!");
      } else {
        await subjectService.addSubject(data);
        toast.success("Subject added successfully!");
      }
      setShowSubjectForm(false);
      setEditingSubject(null);
      fetchSubjects();
    } catch {
      toast.error("Failed to save subject");
    }
  };

    const handleDeleteSubject = async (id) => {
        const confirmDelete = window.confirm("Do you want to delete this subject?");
        if (!confirmDelete) return; // stop if user clicks Cancel
    
        try {
        await subjectService.deleteSubject(id);
        toast.success("Subject deleted successfully!");
        fetchSubjects();
        } catch (error) {
        toast.error("Failed to delete subject");
        }
    };
  

  const handleAddSection = (subject) => {
    setCurrentSubject(subject);
    setShowSectionForm(true);
    setSectionName("");
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName) return toast.error("Enter section name");
    try {
      await subjectService.addSection(currentSubject.id, { sectionName });
      toast.success("Section added successfully!");
      setShowSectionForm(false);
      setCurrentSubject(null);
    } catch {
      toast.error("Failed to add section");
    }
  };

  const handleSubjectClick = (subject) => {
    navigate(`/sections/${subject.id}`, { state: { subjectName: subject.name } });
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <button
          onClick={() => {
            setEditingSubject(null);
            setShowSubjectForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Subject
        </button>
      </div>

      {/* ---------- Table ---------- */}
      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Subject Name</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects?.map((subject, index) => {
              const module = modules.find((m) => m.id === subject.courseModuleId);
              return (
                <tr key={subject.id} className="border-b">
                  <td
                    className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    {subject.name}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="inline-flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingSubject(subject);
                          setShowSubjectForm(true);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                      {/* <button
                        onClick={() => handleAddSection(subject)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Add Section
                      </button> */}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ---------- Subject Form Modal ---------- */}
      {showSubjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowSubjectForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingSubject ? "Edit Subject" : "Add Subject"}
            </h2>
            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={subjectForm.name}
                onChange={handleSubjectChange}
                placeholder="Enter Subject Name"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <select
                name="courseModuleId"
                value={subjectForm.courseModuleId}
                onChange={handleSubjectChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Course Module</option>
                {modules?.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingSubject ? "Update Subject" : "Add Subject"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Section Form Modal ---------- */}
      {showSectionForm && currentSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowSectionForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Add Section for "{currentSubject.name}"
            </h2>
            <form onSubmit={handleSectionSubmit} className="space-y-4">
              <input
                type="text"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                placeholder="Enter Section Name"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Add Section
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}





