import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Profile from "../Pages/Profile";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1200);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { to: "/batch-cycle", label: "Batch Cycles" },
    { to: "/course-type", label: "Course Type" },
    { to: "/premises", label: "Premises" },
    { to: "/infrastructure", label: "Infrastructure" },
    { to: "/staff", label: "Staff" },
    { to: "/course", label: "Course" },
    { to: "/subject", label: "Subjects" },
    { to: "/menu-items", label: "Menu Items" },
    { to: "/roles", label: "Roles" },
    { to: "/schedule", label: "Schedule Report" },
  ];

  const isProfileOpen = location.state?.modal === true;

  return (
    <div className="flex flex-col w-screen h-screen">
      <Header
        title="Admin Dashboard"
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 bg-slate-300 overflow-hidden">
        <Sidebar menuItems={menuItems} isSidebarOpen={isSidebarOpen} />

        <main className="flex-grow p-6 bg-white overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>

      <Footer />

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Profile onClose={() => navigate(-1)} />
        </div>
      )}
    </div>
  );
}
