import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { ThemeContext } from "../providers/ThemeProvider";
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaUsers,
  FaChartBar,
  FaList,
  FaBars,
  FaTimes,
  FaCrown,
  FaUserShield,
  FaArrowLeft,
  FaGlobe,
} from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "../components/Logo";

const DashboardLayout = () => {
  const { user, userRole, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isAdmin = userRole === "admin";

  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaHome className="w-5 h-5" />,
      path: "/dashboard",
      roles: ["user", "admin"],
    },
    {
      label: "My Events",
      icon: <FaCalendarAlt className="w-5 h-5" />,
      path: "/dashboard/my-events",
      roles: ["user", "admin"],
    },
    {
      label: "Joined Events",
      icon: <FaList className="w-5 h-5" />,
      path: "/dashboard/joined-events",
      roles: ["user", "admin"],
    },
    {
      label: "Profile",
      icon: <FaUser className="w-5 h-5" />,
      path: "/dashboard/profile",
      roles: ["user", "admin"],
    },
  ];

  const adminMenuItems = [
    {
      label: "All Events",
      icon: <FaChartBar className="w-5 h-5" />,
      path: "/dashboard/admin/events",
      roles: ["admin"],
    },
    {
      label: "All Users",
      icon: <FaUsers className="w-5 h-5" />,
      path: "/dashboard/admin/users",
      roles: ["admin"],
    },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 ${isAdmin ? "admin-dashboard" : ""}`}>
      {/* Top Navbar - Same Design as Main Navbar for Consistency */}
      <header className="sticky top-0 z-50">
        <nav className="relative">
        {/* Background with green gradient - Minimal Style */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-accent dark:from-primary/90 dark:via-primary/85 dark:to-accent/90 backdrop-blur-xl border-b border-primary/20 dark:border-primary/30 shadow-lg" />
          
          {/* Content */}
          <div className="relative navbar max-w-7xl mx-auto px-4 md:px-6 py-4">
            {/* LEFT — Brand + mobile menu */}
            <div className="navbar-start gap-3">
              {/* Mobile menu button */}
              <button
                className="btn btn-ghost btn-circle lg:hidden text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
              </button>

              {/* Professional Logo - Light variant for colored background */}
              <Logo variant="light" />
              <div className="hidden sm:block ml-2 pl-4 border-l border-white/20">
                <div className="text-xs text-white/80 font-medium uppercase tracking-wider">Dashboard</div>
              </div>
            </div>

            {/* CENTER — Empty for consistency */}
            <div className="navbar-center hidden lg:flex">
            </div>

            {/* RIGHT — Theme toggle + Back to Site + User Info */}
            <div className="navbar-end gap-2 md:gap-3">
              {/* Theme Switch - Same style as main navbar */}
              <label className="swap swap-rotate cursor-pointer p-2.5 rounded-xl hover:bg-white/20 backdrop-blur-md border-2 border-white/30 transition-all hover:scale-110 hover:shadow-lg">
                <input
                  type="checkbox"
                  onChange={toggleTheme}
                  checked={theme === "dark"}
                />
                <svg
                  className="swap-on w-5 h-5 text-white drop-shadow-lg"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-14V1m0 22v-3m9-9h-3M4 12H1m16.95 6.95l-2.12-2.12M7.17 7.17L5.05 5.05m12.12 0l-2.12 2.12M7.17 16.83l-2.12 2.12" />
                </svg>
                <svg
                  className="swap-off w-5 h-5 text-white drop-shadow-lg"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64 13a9 9 0 11-10.63-10A7 7 0 0021.64 13z" />
                </svg>
              </label>

              {/* Back to Site Button */}
              <Link
                to="/"
                className="btn btn-sm md:btn-md bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/40 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 gap-2"
              >
                <FaGlobe className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Site</span>
                <span className="sm:hidden">Site</span>
              </Link>

              {/* User Avatar */}
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar text-white hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transition-all hover:scale-110"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-white/50">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="rounded-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-white/20 text-white font-semibold backdrop-blur-sm">
                        {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <FaCrown className="text-[8px] text-white" />
                    </div>
                  )}
                </label>

                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow-2xl menu menu-sm dropdown-content bg-white/95 dark:bg-base-100/95 backdrop-blur-xl rounded-2xl w-64 space-y-1 border border-white/20 dark:border-base-300"
                >
                  <li className="px-3 py-2 rounded-lg bg-base-200/50 dark:bg-base-200/30">
                    <div className="font-semibold text-sm">
                      {user?.displayName || "User"}
                    </div>
                    <div className="text-xs text-base-content/60 truncate">
                      {user?.email}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {isAdmin ? (
                        <>
                          <FaCrown className="text-accent text-xs" />
                          <span className="text-xs font-medium text-accent">Administrator</span>
                        </>
                      ) : (
                        <>
                          <FaUserShield className="text-primary text-xs" />
                          <span className="text-xs font-medium text-primary">User</span>
                        </>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex relative">
        {/* Sidebar - Professional Design with Admin styling */}
        <aside
          className={`fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-base-100/95 backdrop-blur-lg border-r border-base-300 shadow-xl z-20 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          } ${isAdmin ? "border-r-2 border-accent/30" : ""}`}
        >
          <nav className="p-4 space-y-1 h-full overflow-y-auto">
            {/* User Role Section - Different styling for admin */}
            <div className={`mb-4 p-3 rounded-xl border ${
              isAdmin 
                ? "bg-gradient-to-br from-accent/20 to-accent/10 border-accent/40 shadow-lg" 
                : "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {isAdmin ? (
                  <FaCrown className="text-accent" />
                ) : (
                  <FaUserShield className="text-primary" />
                )}
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  isAdmin ? "text-accent" : "text-base-content/70"
                }`}>
                  {isAdmin ? "Administrator" : "User Account"}
                </span>
              </div>
              <div className={`text-sm font-bold ${isAdmin ? "text-base-content" : "text-base-content"}`}>
                {user?.displayName || "User"}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content shadow-lg scale-[1.02]"
                      : "hover:bg-base-200 text-base-content hover:scale-[1.01]"
                  }`}
                >
                  <span className={isActive(item.path) ? "text-primary-content" : "text-primary"}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Admin Menu Items - Different styling for admin */}
            {isAdmin && (
              <>
                <div className="my-4">
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wide bg-accent/10 px-3 py-1.5 rounded-lg border border-accent/30">
                      <FaCrown className="text-accent" />
                      Admin Panel
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          isActive(item.path)
                            ? "bg-gradient-to-r from-accent to-accent/80 text-accent-content shadow-lg scale-[1.02] border-2 border-accent/50"
                            : "hover:bg-accent/10 text-base-content hover:scale-[1.01] border border-transparent hover:border-accent/30"
                        }`}
                      >
                        <span className={isActive(item.path) ? "text-accent-content" : "text-accent"}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error/10 text-error w-full transition-all group"
              >
                <FaSignOutAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
