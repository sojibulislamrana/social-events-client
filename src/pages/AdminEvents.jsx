import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAllEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/events`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to load events");
        }

        setEvents(data.events || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllEvents();
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
        <h1 className="text-3xl font-bold mb-2">All Events (Admin)</h1>
        <p className="text-base-content/70">
          Manage all events created by all users
        </p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>Error: {error}</span>
        </div>
      )}

      <div className="bg-base-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Creator</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-base-content/70">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id}>
                    <td className="font-medium">{event.title}</td>
                    <td>
                      <span className="badge badge-outline">{event.eventType}</span>
                    </td>
                    <td>{event.location}</td>
                    <td>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td className="text-sm text-base-content/70">
                      {event.creatorEmail}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/event/${event._id}`}
                          className="btn btn-xs btn-outline"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-base-200 rounded-xl p-4">
        <p className="text-sm text-base-content/70">
          <strong>Total Events:</strong> {events.length}
        </p>
      </div>
    </div>
  );
};

export default AdminEvents;

