import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaUsers, FaShareAlt, FaSpinner } from "react-icons/fa";
import CountdownTimer from "../components/CountdownTimer";
import Spinner from "../components/Spinner";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState("");

  // Load event details
  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to load event");
        }

        setEvent(data.event);

        // Load related events (same type)
        if (data.event?.eventType) {
          const relatedRes = await fetch(
            `${import.meta.env.VITE_API_URL}/events/upcoming`
          );
          const relatedData = await relatedRes.json();
          if (relatedData.ok) {
            const related = (relatedData.events || [])
              .filter((e) => e._id !== data.event._id && e.eventType === data.event.eventType)
              .slice(0, 3);
            setRelatedEvents(related);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      toast.error("You must be logged in to join this event.");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!event?._id) {
      toast.error("Event information is not loaded yet.");
      return;
    }

    if (event.eventDate) {
      const eventDate = new Date(event.eventDate);
      const now = new Date();
      if (eventDate <= now) {
        toast.error("This event date has already passed.");
        return;
      }
    }

    try {
      setJoinLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/join-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          userEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to join event.");
      }

      toast.success("You have successfully joined this event! 🎉");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" />
          <p className="text-base-content/70">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="text-sm text-base-content/70">
          {error || "No event data available."}
        </p>
        <Link to="/upcoming-events" className="btn btn-primary">
          Back to Upcoming Events
        </Link>
      </div>
    );
  }

  const eventDateStr = event.eventDate
    ? new Date(event.eventDate).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date not available";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Image Gallery */}
      <div className="bg-base-200 rounded-3xl overflow-hidden shadow-lg">
        <div className="relative h-[400px] md:h-[500px]">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base text-base-content/70 bg-gradient-to-br from-base-300 to-base-200">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">No image available</p>
                <p className="text-sm text-base-content/60">Image will be displayed here when available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Meta */}
          <div className="bg-base-100 rounded-3xl border shadow-sm p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="badge badge-lg badge-outline">{event.eventType}</span>
              <button
                onClick={handleShare}
                className="btn btn-ghost btn-sm"
                aria-label="Share event"
              >
                <FaShareAlt /> Share
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                <span>{eventDateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-secondary" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Overview/Description Section */}
          <div className="bg-base-100 rounded-3xl border shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold">Event Overview</h2>
            <div className="prose max-w-none">
              <p className="text-base text-base-content/80 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>

          {/* Key Information/Specs Section */}
          <div className="bg-base-100 rounded-3xl border shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl font-bold">Event Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-base-content/60 mb-1">
                    Event Type
                  </h3>
                  <p className="text-base">{event.eventType}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-base-content/60 mb-1">
                    Location
                  </h3>
                  <p className="text-base">{event.location}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-base-content/60 mb-1">
                    Event Date & Time
                  </h3>
                  <p className="text-base">{eventDateStr}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-base-content/60 mb-1">
                    Organizer
                  </h3>
                  <p className="text-base flex items-center gap-2">
                    <FaUser className="text-primary" />
                    {event.creatorEmail || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Join Event Card */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl border shadow-sm p-6 space-y-4">
            <h3 className="text-xl font-bold">Join This Event</h3>
            
            {/* Countdown Timer */}
            {event.eventDate && (
              <div className="bg-base-100 rounded-xl p-4 border border-primary/20">
                <p className="text-sm font-semibold mb-2 text-base-content/70">Event starts in:</p>
                <CountdownTimer eventDate={event.eventDate} />
              </div>
            )}
            
            <p className="text-sm text-base-content/70">
              Be part of this community initiative and make a difference!
            </p>
            <button
              onClick={handleJoin}
              className="btn btn-primary w-full shadow-lg hover:shadow-xl transition-all"
              disabled={joinLoading}
            >
              {joinLoading ? "Joining..." : "Join Event"}
            </button>
            <Link
              to="/upcoming-events"
              className="btn btn-outline w-full btn-sm"
            >
              Browse More Events
            </Link>
          </div>

          {/* Map Section */}
          <div className="bg-base-100 rounded-2xl border shadow-sm p-6 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" />
              Event Location
            </h3>
            <p className="text-sm text-base-content/70 mb-3">{event.location}</p>
            <div className="w-full h-64 rounded-lg overflow-hidden border border-base-300">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6d-s6U4UZuKM16E&q=${encodeURIComponent(event.location)}`}
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline w-full"
            >
              Open in Google Maps
            </a>
          </div>

          {/* Event Rules/Important Info */}
          <div className="bg-base-100 rounded-2xl border shadow-sm p-6 space-y-3">
            <h3 className="font-semibold">Important Information</h3>
            <ul className="text-sm text-base-content/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Please arrive on time for the event</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Bring any required materials if mentioned</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Contact the organizer for any questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Follow all safety guidelines and protocols</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      {relatedEvents.length > 0 && (
        <div className="bg-base-100 rounded-3xl border shadow-sm p-6 md:p-8 space-y-4">
          <h2 className="text-2xl font-bold">Related Events</h2>
          <p className="text-base-content/70">
            Other {event.eventType} events you might be interested in
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedEvents.map((relatedEvent) => (
              <Link
                key={relatedEvent._id}
                to={`/event/${relatedEvent._id}`}
                className="group overflow-hidden rounded-2xl border bg-base-200 hover:shadow-lg transition-shadow"
              >
                <div className="h-32 bg-base-300 overflow-hidden">
                  {relatedEvent.thumbnail ? (
                    <img
                      src={relatedEvent.thumbnail}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60 bg-gradient-to-br from-base-300 to-base-200">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <span className="badge badge-sm badge-outline">
                    {relatedEvent.eventType}
                  </span>
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {relatedEvent.title}
                  </h3>
                  <p className="text-xs text-base-content/60">
                    {new Date(relatedEvent.eventDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
