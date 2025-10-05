import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Services/AuthContext";

export default function UserDropdown({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-md">
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          onClose();
          // Open Profile modal on top of current page
          navigate(location.pathname, { state: { modal: true } });
        }}
      >
        Profile
      </button>
      <button
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
        onClick={() => {
          onClose();
          logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
