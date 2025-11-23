import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { ThemeContext } from "../providers/ThemeProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    logOut().catch((err) => console.error(err));
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-full text-sm font-medium transition duration-200 ${
      isActive
        ? "bg-primary text-primary-content shadow-sm"
        : "text-base-content/80 hover:bg-base-200"
    }`;

  const navItems = (
    <>
      <li>
        <NavLink to="/" end className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/upcoming-events" className={navLinkClass}>
          Upcoming Events
        </NavLink>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-md border-b">
      <nav className="navbar max-w-6xl mx-auto px-3 md:px-4">
        {/* LEFT — Brand + mobile menu */}
        <div className="navbar-start gap-2">
          {/* Mobile menu */}
          <div className="dropdown lg:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-base-100 rounded-2xl w-56 space-y-1"
            >
              {navItems}

              {user && (
                <>
                  <div className="divider my-1" />
                  <li>
                    <NavLink to="/create-event" className={navLinkClass}>
                      Create Event
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/manage-events" className={navLinkClass}>
                      Manage Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/joined-events" className={navLinkClass}>
                      Joined Events
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="btn btn-ghost px-2 normal-case flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-black text-primary">SE</span>
            </div>
            <span className="text-lg font-bold">SocialEvents</span>
          </Link>
        </div>

        {/* CENTER — Desktop Nav */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1">{navItems}</ul>
        </div>

        {/* RIGHT — Theme toggle + Auth */}
        <div className="navbar-end gap-2 md:gap-3">
          {/* Modern Theme Switch */}
          <label className="swap swap-rotate cursor-pointer">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />

            {/* Sun icon */}
            <svg
              className="swap-on w-6 h-6 text-yellow-400 drop-shadow-glow"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-14V1m0 22v-3m9-9h-3M4 12H1m16.95 6.95l-2.12-2.12M7.17 7.17L5.05 5.05m12.12 0l-2.12 2.12M7.17 16.83l-2.12 2.12" />
            </svg>

            {/* Moon icon */}
            <svg
              className="swap-off w-6 h-6 text-blue-400 drop-shadow-glow"
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
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-9 h-9 rounded-full ring ring-primary/40 ring-offset-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-base-200 font-semibold">
                      {user.displayName ? user.displayName.charAt(0) : "U"}
                    </div>
                  )}
                </div>
              </label>

              <ul
                tabIndex={0}
                className="mt-3 p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-2xl w-60 space-y-1"
              >
                <li className="px-2 pb-1">
                  <span className="font-semibold text-sm">
                    {user.displayName || "User"}
                  </span>
                  <span className="text-[11px] text-base-content/70">
                    {user.email}
                  </span>
                </li>

                <div className="divider my-1" />

                <li>
                  <Link to="/create-event">Create Event</Link>
                </li>
                <li>
                  <Link to="/manage-events">Manage Events</Link>
                </li>
                <li>
                  <Link to="/joined-events">Joined Events</Link>
                </li>

                <div className="divider my-1" />

                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-error btn-sm w-full"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-sm btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
