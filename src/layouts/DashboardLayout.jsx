import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
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
} from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user, userRole, logOut } = useContext(AuthContext);
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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      {/* Top Navbar - Professional Design */}
      <header className="bg-base-100/95 backdrop-blur-lg border-b border-base-300 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden btn btn-ghost btn-sm btn-circle"
              >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-lg font-black text-base-100">SE</span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-bold text-lg text-base-content">SocialEvents</div>
                  <div className="text-xs text-base-content/60">Dashboard</div>
                </div>
              </Link>
            </div>

            {/* Right: User Info & Actions */}
            <div className="flex items-center gap-4">
              {/* User Role Badge */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                {isAdmin ? (
                  <>
                    <FaCrown className="text-accent" />
                    <span className="text-sm font-semibold text-base-content">Admin</span>
                  </>
                ) : (
                  <>
                    <FaUserShield className="text-primary" />
                    <span className="text-sm font-semibold text-base-content">User</span>
                  </>
                )}
              </div>

              {/* User Avatar & Info */}
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <div className="font-semibold text-sm">{user?.displayName || "User"}</div>
                  <div className="text-xs text-base-content/60 truncate max-w-[150px]">
                    {user?.email}
                  </div>
                </div>
                <div className="relative">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-10 h-10 rounded-full ring-2 ring-primary/30 shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-base-100 flex items-center justify-center font-bold ring-2 ring-primary/30 shadow-md">
                      {user?.displayName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-base-100 flex items-center justify-center">
                      <FaCrown className="text-[8px] text-base-100" />
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/"
                className="btn btn-ghost btn-sm hidden md:flex"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar - Professional Design */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-base-100/95 backdrop-blur-lg border-r border-base-300 shadow-xl z-20 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <nav className="p-4 space-y-1 h-full overflow-y-auto">
            {/* User Role Section */}
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                {isAdmin ? (
                  <FaCrown className="text-accent" />
                ) : (
                  <FaUserShield className="text-primary" />
                )}
                <span className="text-xs font-semibold text-base-content/70 uppercase tracking-wide">
                  {isAdmin ? "Administrator" : "User Account"}
                </span>
              </div>
              <div className="text-sm font-bold text-base-content">
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

            {/* Admin Menu Items */}
            {isAdmin && (
              <>
                <div className="my-4">
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-base-content/50 uppercase tracking-wide">
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
                            ? "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-content shadow-lg scale-[1.02]"
                            : "hover:bg-base-200 text-base-content hover:scale-[1.01]"
                        }`}
                      >
                        <span className={isActive(item.path) ? "text-secondary-content" : "text-secondary"}>
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
