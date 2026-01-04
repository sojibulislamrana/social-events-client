import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaUsers, FaCrown, FaUserShield, FaSpinner } from "react-icons/fa";
import Spinner from "../components/Spinner";

const AdminUsers = () => {
  const { user, userRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (userRole === "admin" && user?.email) {
      loadUsers();
    }
  }, [userRole, user?.email]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users?requestorEmail=${user.email}`
      );
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userEmail, newRole) => {
    if (!user?.email) {
      toast.error("You must be logged in");
      return;
    }

    try {
      setUpdating({ ...updating, [userEmail]: true });
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${userEmail}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
            requestorEmail: user.email,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      toast.success(`User role updated to ${newRole}`);
      loadUsers(); // Reload users
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update role");
    } finally {
      setUpdating({ ...updating, [userEmail]: false });
    }
  };

  if (userRole !== "admin") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-base-content/70">Only administrators can access this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaUsers className="text-primary" />
            User Management
          </h1>
          <p className="text-base-content/70 mt-1">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      <div className="bg-base-100 rounded-3xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-base-content/70">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.email}>
                    <td>
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img
                            src={u.photoURL}
                            alt={u.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            {u.displayName?.charAt(0) || u.email.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">
                            {u.displayName || "No name"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === "admin"
                            ? "badge-accent"
                            : "badge-primary"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <>
                            <FaCrown className="mr-1" /> Admin
                          </>
                        ) : (
                          <>
                            <FaUserShield className="mr-1" /> User
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {u.role === "user" ? (
                          <button
                            className="btn btn-sm btn-accent"
                            onClick={() => updateUserRole(u.email, "admin")}
                            disabled={updating[u.email]}
                          >
                            {updating[u.email] ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <FaCrown className="mr-1" /> Make Admin
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => updateUserRole(u.email, "user")}
                            disabled={updating[u.email]}
                          >
                            {updating[u.email] ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <FaUserShield className="mr-1" /> Make User
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
