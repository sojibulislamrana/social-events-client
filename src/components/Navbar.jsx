import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { ThemeContext } from "../providers/ThemeProvider";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut().catch((err) => console.error(err));
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-white/25 dark:bg-white/15 text-white shadow-xl backdrop-blur-md border-2 border-white/40 font-semibold scale-105"
        : "text-white/95 hover:bg-white/15 hover:text-white hover:backdrop-blur-md border border-transparent hover:border-white/30 hover:scale-105"
    }`;

  const navItems = (
    <>
      <li>
        <NavLink to="/" end className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
          <FaHome className="inline mr-2" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/upcoming-events" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
          Explore Events
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* Glassmorphism Navbar */}
      <nav className="relative">
        {/* Background with gradient and glass effect - Enhanced */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/90 dark:from-primary/70 dark:via-primary/60 dark:to-secondary/70 backdrop-blur-2xl border-b border-white/30 dark:border-white/20 shadow-2xl" />
        {/* Animated gradient overlay for extra pop */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        
        {/* Content */}
        <div className="relative navbar max-w-7xl mx-auto px-4 md:px-6 py-4">
          {/* LEFT — Brand + mobile menu */}
          <div className="navbar-start gap-3">
            {/* Mobile menu button */}
            <button
              className="btn btn-ghost btn-circle lg:hidden text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>

            {/* Logo - Enhanced */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 dark:from-white/20 dark:to-white/5 backdrop-blur-md flex items-center justify-center shadow-xl border-2 border-white/40 dark:border-white/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <span className="text-xl font-black text-white drop-shadow-lg">SE</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-white drop-shadow-lg group-hover:drop-shadow-xl transition-all">SocialEvents</span>
                <p className="text-[10px] text-white/90 leading-tight font-medium">Community Platform</p>
              </div>
            </Link>
          </div>

          {/* CENTER — Desktop Nav */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-2 px-1">
              {navItems}
              {user && (
                <>
                  <li>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/create-event" className={navLinkClass}>
                      Create Event
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* RIGHT — Theme toggle + Auth */}
          <div className="navbar-end gap-2 md:gap-3">
            {/* Theme Switch - Glass Style - Enhanced */}
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

            {/* Auth Section */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar text-white hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transition-all hover:scale-110"
                >
                  <div className="w-10 h-10 rounded-full ring-2 ring-white/50">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="avatar" className="rounded-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-white/20 text-white font-semibold backdrop-blur-sm">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="mt-3 p-2 shadow-2xl menu menu-sm dropdown-content bg-white/95 dark:bg-base-100/95 backdrop-blur-xl rounded-2xl w-64 space-y-1 border border-white/20 dark:border-base-300"
                >
                  <li className="px-3 py-2 rounded-lg bg-base-200/50 dark:bg-base-200/30">
                    <div className="font-semibold text-sm">
                      {user.displayName || "User"}
                    </div>
                    <div className="text-xs text-base-content/60 truncate">
                      {user.email}
                    </div>
                  </li>

                  <div className="divider my-1" />

                  <li>
                    <Link to="/dashboard" className="flex items-center gap-2 rounded-lg hover:bg-base-200 dark:hover:bg-base-300">
                      <FaHome className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-event" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300">Create Event</Link>
                  </li>
                  <li>
                    <Link to="/manage-events" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300">Manage Events</Link>
                  </li>
                  <li>
                    <Link to="/joined-events" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300">Joined Events</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/profile" className="flex items-center gap-2 rounded-lg hover:bg-base-200 dark:hover:bg-base-300">
                      <FaUser className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>

                  <div className="divider my-1" />

                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-error hover:bg-error/10 rounded-lg w-full"
                    >
                      <FaSignOutAlt className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-sm bg-white/25 dark:bg-white/15 text-white border-2 border-white/40 hover:bg-white/35 dark:hover:bg-white/25 backdrop-blur-md transition-all shadow-lg hover:scale-110 hover:shadow-xl font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm bg-white text-primary hover:bg-white/95 shadow-xl transition-all hover:scale-110 hover:shadow-2xl font-semibold border-2 border-transparent hover:border-primary/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Glass Style */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-base-100/95 backdrop-blur-xl border-b border-white/20 dark:border-base-300 shadow-2xl">
          <ul className="menu p-4 space-y-1">
            {navItems}
            {user && (
              <>
                <div className="divider my-2" />
                <li>
                  <Link to="/dashboard" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/create-event" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300" onClick={() => setMobileMenuOpen(false)}>
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link to="/manage-events" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300" onClick={() => setMobileMenuOpen(false)}>
                    Manage Events
                  </Link>
                </li>
                <li>
                  <Link to="/joined-events" className="rounded-lg hover:bg-base-200 dark:hover:bg-base-300" onClick={() => setMobileMenuOpen(false)}>
                    Joined Events
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
