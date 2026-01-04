import { useEffect, useState } from "react";
import { FaUsers, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const AdminUsers = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalJoined: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
        const data = await res.json();

        if (res.ok && data.ok) {
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Statistics (Admin)</h1>
        <p className="text-base-content/70">
          Overview of platform users and activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaUsers className="text-3xl text-primary" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalUsers}</div>
          <p className="text-sm text-base-content/70">Total Users</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaCalendarAlt className="text-3xl text-secondary" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalEvents}</div>
          <p className="text-sm text-base-content/70">Total Events</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FaEnvelope className="text-3xl text-accent" />
          </div>
          <div className="text-3xl font-bold mb-2">{stats.totalJoined}</div>
          <p className="text-sm text-base-content/70">Total Participations</p>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
        <div className="space-y-2 text-sm text-base-content/70">
          <p>
            • User management features can be extended based on requirements
          </p>
          <p>
            • Additional admin features like user deletion, event moderation, etc. can be added
          </p>
          <p>
            • This is a demo admin panel showing basic statistics and event management
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

