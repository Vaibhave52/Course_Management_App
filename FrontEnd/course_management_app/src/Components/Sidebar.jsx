import { NavLink } from "react-router-dom";

export default function Sidebar({ menuItems, isSidebarOpen }) {
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-0"
      } transition-all duration-300 bg-slate-100 shadow-lg overflow-y-auto`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block text-lg p-3 rounded-md whitespace-nowrap ${
                isActive
                  ? "bg-violet-400 text-white"
                  : "hover:bg-gray-200 text-gray-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
