import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../Services/axiosInstance";

export default function SectionPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const subjectName = location.state?.subjectName || `Subject ${subjectId}`;

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionName, setSectionName] = useState("");

  // Fetch sections
  useEffect(() => {
    fetchSections();
  }, [subjectId]);

  const fetchSections = async () => {
    try {
      const res = await axiosInstance.get(`/section/${subjectId}`);
      setSections(res.data || []);
    } catch (err) {
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  };

  // Handle add/edit section submit
  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!sectionName) return toast.error("Enter section name");

    try {
      if (editingSection) {
        await axiosInstance.put(`/section/update/${editingSection.id}`, {
          sectionName,
          subjectId: Number(subjectId),
        });
        toast.success("Section updated successfully!");
      } else {
        await axiosInstance.post(`/section/add`, {
          sectionName,
          subjectId: Number(subjectId),
        });
        toast.success("Section added successfully!");
      }
      setShowSectionForm(false);
      setEditingSection(null);
      setSectionName("");
      fetchSections();
    } catch {
      toast.error("Failed to save section");
    }
  };

  // Delete section
  const handleDeleteSection = async (id) => {
    if (!window.confirm("Are you sure to delete this section?")) return;
    try {
      await axiosInstance.delete(`/section/${id}`);
      toast.success("Section deleted successfully!");
      fetchSections();
    } catch {
      toast.error("Failed to delete section");
    }
  };

  // Open edit modal
  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionName(section.sectionName);
    setShowSectionForm(true);
  };

  // Navigate to topics
  const handleSectionClick = (section) => {
    navigate(`/topics/${section.id}`, {
      state: { sectionName: section.sectionName },
    });
  };

  if (loading) return <p>Loading sections...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{subjectName}</h1>
        <button
          onClick={() => {
            setEditingSection(null);
            setSectionName("");
            setShowSectionForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Section
        </button>
      </div>

      {/* Section Form Modal */}
      {showSectionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => {
                setShowSectionForm(false);
                setEditingSection(null);
                setSectionName("");
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingSection
                ? "Edit Section"
                : `Add Section for "${subjectName}"`}
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
                {editingSection ? "Update Section" : "Add Section"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Section Table */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Section Name</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr key={section.id} className="border-b">
              <td
                className="p-2 cursor-pointer text-blue-600 hover:underline"
                onClick={() => handleSectionClick(section)}
              >
                {section.sectionName}
              </td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEditSection(section)}
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
