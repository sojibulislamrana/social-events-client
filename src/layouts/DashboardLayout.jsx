import { Outlet, Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaChartBar,
  FaList,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  
  // Check if user is admin (for demo purposes, check email)
  const isAdmin = user?.email === "admin@demo.com" || user?.email?.includes("admin");

  const menuItems = [
    {
      label: "Dashboard Home",
      icon: <FaHome />,
      path: "/dashboard",
      roles: ["user", "admin"],
    },
    {
      label: "My Events",
      icon: <FaCalendarAlt />,
      path: "/dashboard/my-events",
      roles: ["user", "admin"],
    },
    {
      label: "Joined Events",
      icon: <FaList />,
      path: "/dashboard/joined-events",
      roles: ["user", "admin"],
    },
    {
      label: "Profile",
      icon: <FaUser />,
      path: "/dashboard/profile",
      roles: ["user", "admin"],
    },
  ];

  const adminMenuItems = [
    {
      label: "All Events",
      icon: <FaChartBar />,
      path: "/dashboard/admin/events",
      roles: ["admin"],
    },
    {
      label: "All Users",
      icon: <FaUsers />,
      path: "/dashboard/admin/users",
      roles: ["admin"],
    },
  ];

  const handleLogout = () => {
    logOut().catch((err) => console.error(err));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navbar */}
      <header className="bg-base-100 border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xl font-bold text-primary">
                SocialEvents
              </Link>
              <span className="text-base-content/50">|</span>
              <span className="text-sm text-base-content/70">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold">
                    {user?.displayName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="hidden md:block text-sm">
                  <div className="font-medium">{user?.displayName || "User"}</div>
                  <div className="text-xs text-base-content/60">{user?.email}</div>
                </div>
              </div>
              <Link to="/" className="btn btn-ghost btn-sm">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-base-100 border-r min-h-[calc(100vh-64px)] sticky top-16">
          <nav className="p-4 space-y-2">
            {/* User Menu Items */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-primary text-primary-content"
                    : "hover:bg-base-200 text-base-content"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}

            {/* Admin Menu Items */}
            {isAdmin && (
              <>
                <div className="divider my-4">
                  <span className="text-xs text-base-content/50">Admin</span>
                </div>
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? "bg-secondary text-secondary-content"
                        : "hover:bg-base-200 text-base-content"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </>
            )}

            <div className="divider my-4" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-error/10 text-error w-full text-left"
            >
              <FaSignOutAlt />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

