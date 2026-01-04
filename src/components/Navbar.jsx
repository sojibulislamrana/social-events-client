import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { ThemeContext } from "../providers/ThemeProvider";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaHome } from "react-icons/fa";

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
    `px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-base-100 text-primary shadow-md font-semibold"
        : "text-base-100/90 hover:bg-base-100/20 hover:text-base-100 hover:scale-105"
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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary/95 to-secondary backdrop-blur-lg border-b border-primary/30 shadow-xl">
      <nav className="navbar max-w-7xl mx-auto px-4 md:px-6 py-3">
        {/* LEFT — Brand + mobile menu */}
        <div className="navbar-start gap-3">
          {/* Mobile menu button */}
          <button
            className="btn btn-ghost btn-circle lg:hidden text-base-100 hover:bg-base-100/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-base-100/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-base-100/30">
              <span className="text-xl font-black text-base-100">SE</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-base-100">SocialEvents</span>
              <p className="text-[10px] text-base-100/80 leading-tight">Community Platform</p>
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
          {/* Theme Switch */}
          <label className="swap swap-rotate cursor-pointer p-2 rounded-lg hover:bg-base-100/20 transition-colors">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <svg
              className="swap-on w-5 h-5 text-base-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-14V1m0 22v-3m9-9h-3M4 12H1m16.95 6.95l-2.12-2.12M7.17 7.17L5.05 5.05m12.12 0l-2.12 2.12M7.17 16.83l-2.12 2.12" />
            </svg>
            <svg
              className="swap-off w-5 h-5 text-base-100"
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
                className="btn btn-ghost btn-circle avatar text-base-100 hover:bg-base-100/20 border-2 border-base-100/30"
              >
                <div className="w-10 h-10 rounded-full ring-2 ring-base-100/50">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" className="rounded-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-primary/80 text-base-100 font-semibold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              </label>

              <ul
                tabIndex={0}
                className="mt-3 p-2 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-2xl w-64 space-y-1 border border-base-300"
              >
                <li className="px-3 py-2 rounded-lg bg-base-200/50">
                  <div className="font-semibold text-sm">
                    {user.displayName || "User"}
                  </div>
                  <div className="text-xs text-base-content/60 truncate">
                    {user.email}
                  </div>
                </li>

                <div className="divider my-1" />

                <li>
                  <Link to="/dashboard" className="flex items-center gap-2 rounded-lg">
                    <FaHome className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/create-event" className="rounded-lg">Create Event</Link>
                </li>
                <li>
                  <Link to="/manage-events" className="rounded-lg">Manage Events</Link>
                </li>
                <li>
                  <Link to="/joined-events" className="rounded-lg">Joined Events</Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="flex items-center gap-2 rounded-lg">
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
                className="btn btn-sm bg-base-100/20 text-base-100 border-base-100/30 hover:bg-base-100 hover:text-primary transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-sm bg-base-100 text-primary hover:bg-base-200 shadow-md transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100/95 backdrop-blur-lg border-b border-base-300 shadow-xl">
          <ul className="menu p-4 space-y-1">
            {navItems}
            {user && (
              <>
                <div className="divider my-2" />
                <li>
                  <Link to="/dashboard" className="rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/create-event" className="rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link to="/manage-events" className="rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    Manage Events
                  </Link>
                </li>
                <li>
                  <Link to="/joined-events" className="rounded-lg" onClick={() => setMobileMenuOpen(false)}>
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
