import { useState } from "react";
import UserDropdown from "./UserDropdown";
import { useAuth } from "../Services/AuthContext";

export default function Header({
  title,
  toggleSidebar,
  isSidebarOpen,
  openProfile,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const { auth, logout } = useAuth();

  return (
    <header className="bg-violet-600 text-white p-4 shadow-md flex justify-between items-center">
      {/* Sidebar Toggle Button */}
      <button
        className="bg-violet-500 hover:bg-violet-700 px-3 py-1 rounded-md mr-4"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? "☰ Close" : "☰ Menu"}
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold flex-grow text-center">{title}</h1>

      {/* User Profile */}
      <div className="relative">
        <div
          className="flex items-center cursor-pointer space-x-2"
          onClick={toggleDropdown}
        >
          <img
            src="https://www.w3schools.com/howto/img_avatar.png"
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-lg hidden md:block">
            {auth?.name || "User"}
          </span>
        </div>

        {isDropdownOpen && (
          <UserDropdown
            onClose={closeDropdown}
            openProfile={openProfile} // pass this callback
          />
        )}
      </div>
    </header>
  );
}
