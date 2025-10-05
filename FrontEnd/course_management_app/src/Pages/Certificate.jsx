import { useState } from "react";

function CertificatePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [certificateData, setCertificateData] = useState({
    recipientName: "",
    field: "",
    leftSignature:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAgMjBDMjAgMTAgNDAgMzAgNjAgMTBDODAgMzAgMTAwIDEwIDExMCAyMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+",
    rightSignature:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTIwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAgMzBDMzAgMTAgNTAgMzAgNzAgMTBDOTAgMzAgMTEwIDEwIDExNSAyNSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+",
    leftSignerName: "Dr. Ankur Chavan",
    leftSignerPosition: "Director",
    rightSignerName: "Prof. Vaibhav Ramteka",
    rightSignerPosition: "Head of Department",
    logoImage:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjYTE2MjA3Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QTwvdGV4dD4KPC9zdmc+",
  });

  const courses = [
    "Development in Advance Computing",
    "DMC",
    "DBDA",
    "DESD",
    "Cyber Security",
  ];

  const handleGenerate = () => {
    if (!studentName.trim() || !selectedCourse.trim()) {
      alert("Please enter student name and select a course.");
      return;
    }

    setCertificateData((prev) => ({
      ...prev,
      recipientName: studentName,
      field: selectedCourse,
    }));

    setShowCertificate(true);
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const certificateElement = document.querySelector(
        ".certificate-download"
      );
      if (!certificateElement) return;

      const canvas = await html2canvas(certificateElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("landscape", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        20,
        (pageHeight - imgHeight) / 2,
        imgWidth,
        imgHeight
      );
      pdf.save(`${certificateData.recipientName}_Certificate.pdf`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 p-6 flex flex-col items-center">
      {/* Input Form */}
      {!showCertificate && (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg border border-amber-300">
          <h2 className="text-2xl font-semibold text-amber-700 mb-4 text-center">
            Generate Student Certificate
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Student Name</label>
            <input
              type="text"
              placeholder="Enter student name"
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Select Course</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Select Course --</option>
              {courses.map((course, i) => (
                <option key={i} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              onClick={handleGenerate}
              className="bg-amber-500 text-white px-5 py-2 rounded hover:bg-amber-600 transition"
            >
              Generate Certificate
            </button>
          </div>
        </div>
      )}

      {/* Certificate Display */}
      {showCertificate && (
        <div className="container mx-auto mt-10">
          <div
            className="relative transition-all duration-300 max-w-4xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`absolute top-4 right-4 md:top-5 md:right-5 w-10 h-10 md:w-12 md:h-12 bg-white/90 border-2 border-amber-600 rounded-full flex items-center justify-center cursor-pointer z-20 transition-all duration-300 shadow-lg hover:scale-110 hover:bg-white hover:shadow-xl ${
                isHovered ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
              onClick={handleDownload}
              title="Download Certificate"
            >
              <svg
                className="w-4 h-4 md:w-5 md:h-5 text-amber-600 hover:text-amber-800 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>

            {/* Certificate */}
            <div className="certificate-download bg-white rounded-2xl border-8 border-amber-600 shadow-2xl relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23a16207' fill-opacity='0.05'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
              <div className="relative z-10 p-6 md:p-12 lg:p-16 text-center">
                {certificateData.logoImage && (
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-md mx-auto mb-4 md:mb-6">
                    <img
                      src={certificateData.logoImage}
                      alt="Organization Logo"
                      className="w-10 h-10 md:w-12 md:h-12 object-contain"
                    />
                  </div>
                )}
                <h1
                  className="text-3xl md:text-5xl lg:text-6xl font-bold text-amber-800 mb-4 md:mb-6 tracking-wider"
                  style={{ fontFamily: "Times New Roman, serif" }}
                >
                  Certificate of Achievement
                </h1>
                <div className="relative w-60 md:w-80 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto my-6 md:my-8">
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-amber-500"></div>
                </div>
                <p
                  className="text-base md:text-lg text-gray-600 mb-4 md:mb-6"
                  style={{ fontFamily: "Times New Roman, serif" }}
                >
                  This certificate is proudly presented to
                </p>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-4 md:p-6 my-6 md:my-8">
                  <h2
                    className="text-2xl md:text-4xl lg:text-5xl font-bold text-amber-800 tracking-wide"
                    style={{ fontFamily: "Times New Roman, serif" }}
                  >
                    {certificateData.recipientName}
                  </h2>
                </div>
                <p
                  className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-2xl mx-auto leading-relaxed px-4"
                  style={{ fontFamily: "Times New Roman, serif" }}
                >
                  For outstanding performance and excellence in the field of{" "}
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg font-semibold">
                    {certificateData.field}
                  </span>
                  . This recognition acknowledges exceptional dedication and
                  achievement.
                </p>
                <div className="mb-6 md:mb-8">
                  <div className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-lg font-medium">
                    Awarded on{" "}
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                {/* Signatures */}
                <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-2xl mx-auto">
                  {[
                    ["left", "Director"],
                    ["right", "Head"],
                  ].map(([side], i) => (
                    <div key={i} className="text-center">
                      <div className="h-12 flex items-center justify-center mb-3">
                        <img
                          src={
                            side === "left"
                              ? certificateData.leftSignature
                              : certificateData.rightSignature
                          }
                          alt={`${side} signature`}
                          className="h-10 object-contain filter drop-shadow-sm"
                        />
                      </div>
                      <div className="border-t-2 border-gray-400 pt-2 max-w-48 mx-auto">
                        <div className="font-semibold text-gray-700 text-base md:text-lg mb-1">
                          {side === "left"
                            ? certificateData.leftSignerName
                            : certificateData.rightSignerName}
                        </div>
                        <div className="text-amber-800 font-medium text-sm md:text-base">
                          {side === "left"
                            ? certificateData.leftSignerPosition
                            : certificateData.rightSignerPosition}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-600 to-amber-500 rounded-full mx-auto mt-8 md:mt-12 shadow-lg flex items-center justify-center">
                  <span className="text-white text-lg md:text-2xl font-bold">
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Back to Form
            </button>
            <p className="text-gray-600 text-sm mt-2">
              Hover to see download option • PDF includes student name
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificatePage;
