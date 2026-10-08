import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Topbar = () => {
  const { user, logout } = useAuth();

  const role = user?.role?.toUpperCase();

  /* ================= THEME ================= */
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  /* ================= PROFILE DROPDOWN ================= */
  const [open, setOpen] = useState(false);

  const titleMap = {
    FARMER: "Farmer Dashboard",
    DISTRIBUTOR: "Distributor Dashboard",
    CUSTOMER: "Customer Dashboard",
  };

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b flex items-center justify-between px-6 relative">
      {/* LEFT */}
      <h1 className="text-lg font-bold text-gray-800 dark:text-white">
        {titleMap[role] || "Dashboard"}
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4 relative">
        {/* 🌗 Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="text-sm px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {theme === "light" ? "🌞 Light" : "🌙 Dark"}
        </button>

        {/* 👤 Profile */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
            {user?.name?.[0] || role?.[0]}
          </div>
        </button>

        {/* 🔽 Dropdown */}
        {open && (
          <div className="absolute right-0 top-14 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 z-50">
            <div className="p-4 border-b dark:border-gray-700">
              <p className="font-bold dark:text-white">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 uppercase">
                {role}
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
