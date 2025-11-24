import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const JoinedEvents = () => {
  const { user } = useContext(AuthContext);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.email) return;

    const loadJoined = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/joined?email=${encodeURIComponent(
            user.email
          )}`
        );
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to load joined events.");
        }

        setJoinedEvents(data.joinedEvents || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
        toast.error(err.message || "Failed to load joined events.");
      } finally {
        setLoading(false);
      }
    };

    loadJoined();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user?.email) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-sm text-base-content/70">
          Please log in to see your joined events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Joined Events</h1>
          <p className="text-sm md:text-base text-base-content/70">
            Events you have joined, sorted by event date.
          </p>
        </div>
        <Link
          to="/upcoming-events"
          className="btn btn-primary btn-sm md:btn-md"
        >
          Browse More Events
        </Link>
      </div>

      {error && (
        <p className="text-xs text-red-500">
          Error loading joined events: {error}
        </p>
      )}

      {joinedEvents.length === 0 ? (
        <p className="text-sm text-base-content/70">
          You have not joined any events yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {joinedEvents.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-2xl border bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="h-40 bg-base-200 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.eventTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="badge badge-outline">{item.eventType}</span>
                  <span className="text-xs text-base-content/60">
                    {item.eventDate
                      ? new Date(item.eventDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <h2 className="font-semibold text-sm md:text-base line-clamp-2">
                  {item.eventTitle}
                </h2>
                <p className="text-xs md:text-sm text-base-content/70 line-clamp-2">
                  {item.location}
                </p>
                <p className="text-[11px] text-base-content/60 mt-auto">
                  Joined at:{" "}
                  {item.joinedAt
                    ? new Date(item.joinedAt).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedEvents;
