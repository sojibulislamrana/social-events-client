import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/events/upcoming`
        );
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to load events");
        }
        setEvents(data.events);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-sm">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Upcoming Events
          </h1>
          <p className="text-sm md:text-base text-base-content/70">
            Showing all upcoming social development events created by users.
          </p>
        </div>
        <Link to="/create-event" className="btn btn-primary btn-sm md:btn-md">
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-base-content/70">
          No upcoming events found. Be the first to create one!
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event._id}
              className="overflow-hidden rounded-2xl border bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="h-40 bg-base-200 overflow-hidden">
                {event.thumbnail ? (
                  <img
                    src={event.thumbnail}
                    alt={event.title}
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
                  <span className="badge badge-outline">{event.eventType}</span>
                  <span className="text-xs text-base-content/60">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <h2 className="font-semibold text-sm md:text-base line-clamp-2">
                  {event.title}
                </h2>
                <p className="text-xs md:text-sm text-base-content/70 line-clamp-2">
                  {event.location}
                </p>
                <div className="mt-3">
                  <Link
                    to={`/event/${event._id}`}
                    className="btn btn-sm btn-outline w-full"
                  >
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

export default UpcomingEvents;
