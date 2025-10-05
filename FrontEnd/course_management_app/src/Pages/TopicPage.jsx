import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getAllTopics, addTopic, updateTopic, deleteTopic } from "../Services/TopicService";

export default function TopicPage() {
  const { sectionId } = useParams();
  const location = useLocation();
  const sectionName = location.state?.sectionName || `Section ${sectionId}`;

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchTopics();
  }, [sectionId]);

  const fetchTopics = async () => {
    try {
      const data = await getAllTopics(sectionId);
      setTopics(data);
    } catch {
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await updateTopic(editingTopic.id, { name: formData.name, sectionId });
        toast.success("Topic updated successfully!");
      } else {
        await addTopic({ name: formData.name, sectionId });
        toast.success("Topic added successfully!");
      }
      setShowForm(false);
      setEditingTopic(null);
      setFormData({ name: "" });
      fetchTopics();
    } catch {
      toast.error("Failed to save topic");
    }
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic);
    setFormData({ name: topic.topicName });
    setShowForm(true);
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure to delete this topic?")) return;
    try {
      await deleteTopic(topicId);
      toast.success("Topic deleted successfully!");
      fetchTopics();
    } catch {
      toast.error("Failed to delete topic");
    }
  };

  if (loading) return <p className="p-6">Loading topics...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{sectionName}</h1>
        <button
          onClick={() => {
            setEditingTopic(null);
            setFormData({ name: "" });
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Topic
        </button>
      </div>

      {/* Topic Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTopic(null);
                setFormData({ name: "" });
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingTopic ? "Edit Topic" : `Add Topic for ${sectionName}`}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter Topic Name"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {editingTopic ? "Update Topic" : "Add Topic"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Topic Table */}
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Topic Name</th>
                <th className="px-4 py-2 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {topics.map((t) => (
                <tr key={t.id} className="border-b">
                    <td className="px-4 py-2">{t.topicName}</td>
                    <td className="px-4 py-2 text-center">
                    <div className="inline-flex space-x-2">
                        <button
                        onClick={() => handleEditTopic(t)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                        Edit
                        </button>
                        <button
                        onClick={() => handleDeleteTopic(t.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                        Delete
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}












































