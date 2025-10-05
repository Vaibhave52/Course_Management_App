// install this dependency
// yarn add jspdf
//yarn add @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import jsPDF from "jspdf";
import {
  getSchedules,
  fetchAllDropdowns,
  deleteSchedule,
  addSchedule,
  updateSchedule,
  generateScheduleReport,
} from "../Services/ScheduleService";

export default function SchedulePage({ viewOnly }) {
  // <-- use viewOnly prop
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [modules, setModules] = useState([]);
  const [infrastructures, setInfrastructures] = useState([]);
  const [groups, setGroups] = useState([]);
  const [staff, setStaff] = useState([]);

  const [showReportForm, setShowReportForm] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  // Fetch schedules and dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, dropdowns] = await Promise.all([
          getSchedules(),
          fetchAllDropdowns(),
        ]);
        setSchedules(schedulesRes.data);
        setModules(dropdowns.modules);
        setInfrastructures(dropdowns.infrastructures);
        setGroups(dropdowns.groups);
        setStaff(dropdowns.staff);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load schedules or dropdowns");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await getSchedules();
      setSchedules(res.data);
    } catch {
      toast.error("Failed to load schedules");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;
    try {
      await deleteSchedule(id);
      toast.success("Schedule deleted successfully!");
      fetchSchedules();
      setEditData(null);
      setSelectedSchedule(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting schedule");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editData) {
        await updateSchedule(editData.id, formData);
        toast.success("Schedule updated successfully!");
      } else {
        await addSchedule(formData);
        toast.success("Schedule added successfully!");
      }
      fetchSchedules();
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error(err);
      toast.error("Error saving schedule");
    }
  };

  const calendarEvents = schedules.map((s) => ({
    id: s.id,
    title: `${s.moduleName} - ${s.staffName?.join(", ") || ""}`,
    start: `${s.date}T${s.startTime}`,
    end: `${s.date}T${s.endTime}`,
    extendedProps: { ...s },
  }));

  if (loading) return <p className="p-6 text-center">Loading schedules...</p>;

  // ---------------- ScheduleForm Component ----------------
  const ScheduleFormInline = ({ onClose, onSubmit, editData }) => {
    const [formData, setFormData] = useState({
      date: "",
      startTime: "",
      endTime: "",
      courseModuleId: "",
      infrastructureId: [],
      groupIds: [],
      staffId: [],
      comment: "",
    });

    useEffect(() => {
      if (editData) {
        setFormData({
          date: editData.date,
          startTime: editData.startTime,
          endTime: editData.endTime,
          courseModuleId: editData.courseModuleId || editData.moduleId,
          infrastructureId: editData.infrastructureId || [],
          groupIds: editData.groupIds || [],
          staffId: editData.staffId || [],
          comment: editData.comment || "",
        });
      }
    }, [editData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e, field) => {
      const { value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [field]: checked
          ? [...prev[field], parseInt(value)]
          : prev[field].filter((id) => id !== parseInt(value)),
      }));
    };

    const submitForm = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-[700px] max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">
            {editData ? "Edit Schedule" : "Add Schedule"}
          </h2>
          <form onSubmit={submitForm} className="space-y-4">
            {/* Course Module */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Course Module</label>
                <select
                  name="courseModuleId"
                  value={formData.courseModuleId}
                  onChange={handleChange}
                  className="border rounded w-full p-2"
                  required
                >
                  <option value="">Select Module</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border p-2 rounded h-32 overflow-y-auto">
                <label className="font-semibold mb-1 block">
                  Select Infrastructure
                </label>
                {infrastructures.map((i) => (
                  <label key={i.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={i.id}
                      checked={formData.infrastructureId.includes(i.id)}
                      onChange={(e) =>
                        handleCheckboxChange(e, "infrastructureId")
                      }
                    />
                    {i.title}
                  </label>
                ))}
              </div>
            </div>

            {/* Date + Groups */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="border p-2 rounded h-32 overflow-y-auto">
                <label className="font-semibold mb-1 block">
                  Select Groups
                </label>
                {groups.map((g) => (
                  <label key={g.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={g.id}
                      checked={formData.groupIds.includes(g.id)}
                      onChange={(e) => handleCheckboxChange(e, "groupIds")}
                    />
                    {g.groupName}
                  </label>
                ))}
              </div>
            </div>

            {/* Start/End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
            </div>

            {/* Staff */}
            <div className="border p-2 rounded h-32 overflow-y-auto">
              <label className="font-semibold mb-1 block">Select Staff</label>
              {staff.map((s) => (
                <label key={s.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={s.id}
                    checked={formData.staffId.includes(s.id)}
                    onChange={(e) => handleCheckboxChange(e, "staffId")}
                  />
                  {s.name}
                </label>
              ))}
            </div>

            {/* Comment */}
            <div>
              <label className="block mb-1">Comment</label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Comment"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ---------------- ScheduleReport Component ----------------
  const ScheduleReportInline = () => {
    const createPdf = (data) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Schedule Report", 10, 10);
      let y = 20;
      data.forEach((s, idx) => {
        doc.setFontSize(12);
        doc.text(`Schedule #${idx + 1}`, 10, y);
        y += 7;
        doc.text(`Name: ${s.staffName?.join(", ")}`, 10, y);
        y += 7;
        doc.text(`Module: ${s.moduleName}`, 10, y);
        y += 7;
        doc.text(`Date: ${s.date}`, 10, y);
        y += 7;
        doc.text(`Time: ${s.startTime} - ${s.endTime}`, 10, y);
        y += 7;
        doc.text(`Groups: ${s.groupName?.join(", ")}`, 10, y);
        y += 7;
        doc.text(`Infrastructure: ${s.infrastructureName?.join(", ")}`, 10, y);
        y += 7;
        if (s.comment) {
          doc.text(`Comment: ${s.comment}`, 10, y);
          y += 7;
        }
        doc.line(10, y, 200, y);
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      return doc;
    };

    const viewReport = async () => {
      if (!startDate || !endDate) {
        toast.error("Select dates");
        return;
      }
      try {
        const res = await generateScheduleReport(startDate, endDate);
        if (!res.data.length) {
          toast.info("No schedules found");
          return;
        }
        const doc = createPdf(res.data);
        const url = URL.createObjectURL(doc.output("blob"));
        setPdfUrl(url);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch report");
      }
    };

    const downloadPdf = async () => {
      if (!startDate || !endDate) {
        toast.error("Select dates");
        return;
      }
      try {
        const res = await generateScheduleReport(startDate, endDate);
        if (!res.data.length) {
          toast.info("No schedules found");
          return;
        }
        const doc = createPdf(res.data);
        doc.save(`ScheduleReport_${startDate}_to_${endDate}.pdf`);
        toast.success("PDF downloaded!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to download report");
      }
    };

    return (
      <div>
        <button
          onClick={() => setShowReportForm(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Generate Report
        </button>

        {showReportForm && !pdfUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
              <h3 className="text-xl font-bold mb-4">
                Generate Schedule Report
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={viewReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  View Report
                </button>
                <button
                  onClick={downloadPdf}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    setShowReportForm(false);
                    setPdfUrl(null);
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {pdfUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-[80%] h-[90%] flex flex-col">
              <div className="flex justify-between items-center p-3 border-b">
                <h3 className="text-lg font-bold">Schedule Report Preview</h3>
                <button
                  onClick={() => {
                    setPdfUrl(null);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Close
                </button>
              </div>
              <iframe
                src={pdfUrl}
                className="flex-1 w-full"
                title="PDF Preview"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Schedules</h2>
        <div className="flex gap-2">
          {!viewOnly && (
            <button
              onClick={() => {
                setEditData(null);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Add Schedule
            </button>
          )}
          <ScheduleReportInline />
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        height="80vh"
        hiddenDays={[]}
        eventClick={(info) => {
          const schedule = schedules.find(
            (s) => s.id === parseInt(info.event.id)
          );
          setSelectedSchedule(schedule);
        }}
      />

      {showForm && !viewOnly && (
        <ScheduleFormInline
          onClose={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSubmit={handleFormSubmit}
          editData={editData}
        />
      )}

      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">
            <h3 className="text-xl font-bold mb-4">Schedule Details</h3>
            <div className="space-y-2 text-gray-800">
              <p>
                <strong>Date:</strong> {selectedSchedule.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedSchedule.startTime} -{" "}
                {selectedSchedule.endTime}
              </p>
              <p>
                <strong>Module:</strong> {selectedSchedule.moduleName}
              </p>
              <p>
                <strong>Infrastructure:</strong>{" "}
                {selectedSchedule.infrastructureName?.join(", ")}
              </p>
              <p>
                <strong>Groups:</strong>{" "}
                {selectedSchedule.groupName?.join(", ")}
              </p>
              <p>
                <strong>Staff:</strong> {selectedSchedule.staffName?.join(", ")}
              </p>
              <p>
                <strong>Comment:</strong> {selectedSchedule.comment}
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              {!viewOnly && (
                <>
                  <button
                    onClick={() => {
                      setEditData(selectedSchedule);
                      setShowForm(true);
                      setSelectedSchedule(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedSchedule.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedSchedule(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
