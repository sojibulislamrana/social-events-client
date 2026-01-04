import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaHeart } from "react-icons/fa";
import Spinner from "../components/Spinner";
import CountdownTimer from "../components/CountdownTimer";

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
      <div className="space-y-6">
        <div className="h-8 bg-base-200 rounded animate-pulse" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card-consistent bg-base-100 border-2 border-base-300 rounded-2xl overflow-hidden">
              <div className="h-52 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                <div className="h-4 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />
                <div className="h-8 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
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
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-md">
              <FaHeart className="text-base-100 text-lg" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Joined Events</h1>
          </div>
          <p className="text-sm md:text-base text-base-content/70">
            Events you have joined, sorted by event date.
          </p>
        </div>
        <Link
          to="/upcoming-events"
          className="btn btn-primary btn-sm md:btn-md gap-2"
        >
          <FaCalendarAlt />
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
              className="card-consistent overflow-hidden rounded-2xl border-2 border-base-300 bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:border-secondary/50"
            >
              <div className="relative h-48 bg-base-200 overflow-hidden">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.eventTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60 bg-gradient-to-br from-base-300 to-base-200">
                    No image
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="badge badge-lg bg-secondary text-secondary-content border-0 shadow-lg">
                    {item.eventType}
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-3 flex-1 flex flex-col min-h-[180px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <FaCalendarAlt className="text-primary" />
                    <span>
                      {item.eventDate
                        ? new Date(item.eventDate).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <h2 className="font-bold text-base line-clamp-2 min-h-[3rem]">
                  {item.eventTitle}
                </h2>
                <p className="text-sm text-base-content/70 line-clamp-2 flex items-start gap-2 min-h-[2.5rem]">
                  <FaMapMarkerAlt className="text-secondary mt-0.5 flex-shrink-0" />
                  <span>{item.location}</span>
                </p>
                
                {/* Countdown Timer */}
                {item.eventDate && (
                  <div className="py-2 border-t border-base-300 flex-shrink-0">
                    <CountdownTimer eventDate={item.eventDate} compact />
                  </div>
                )}
                
                <div className="mt-auto pt-2 flex-shrink-0">
                  <div className="flex items-center gap-2 text-xs text-base-content/60">
                    <FaClock className="text-accent" />
                    <span>
                      Joined: {item.joinedAt
                        ? new Date(item.joinedAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <Link
                    to={`/event/${item.eventId || item._id}`}
                    className="btn btn-secondary btn-sm w-full mt-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <FaCalendarAlt />
                    View Event
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedEvents;
