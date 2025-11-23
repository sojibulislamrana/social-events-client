import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import toast from "react-hot-toast";

const Home = () => {
  const [galleryEvents, setGalleryEvents] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [email, setEmail] = useState("");

  // Load some upcoming events for the gallery
  useEffect(() => {
    const loadGalleryEvents = async () => {
      try {
        setGalleryLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/events/upcoming`
        );
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to load events");
        }

        // take first 6 events for gallery
        const items = (data.events || []).slice(0, 6);
        setGalleryEvents(items);
      } catch (err) {
        console.error(err);
        setGalleryError(err.message);
      } finally {
        setGalleryLoading(false);
      }
    };

    loadGalleryEvents();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    // Simple basic pattern check (not perfect, just to avoid empty / junk)
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // No real backend – just UI behaviour
    toast.success("You are now subscribed to event updates!");
    setEmail("");
  };

  return (
    <div className="space-y-12 md:space-y-16">
      {/* 🔹 Banner / Hero Section */}
      <section className="bg-base-200 rounded-3xl px-4 py-10 md:px-10 md:py-14">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left side: text */}
          <div className="flex-1 space-y-5">
            <span className="inline-flex items-center rounded-full bg-base-100 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
              Social Development Events Platform
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Organize &amp; Join Events that{" "}
              <span className="text-primary">Transform Your Community</span>
            </h1>
            <p className="text-sm md:text-base text-base-content/80 max-w-xl">
              Discover upcoming clean-up drives, awareness programs, charity
              events, and more. Create your own events, manage campaigns, and
              track everything you’ve joined in one place.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/upcoming-events" className="btn btn-primary">
                Browse Upcoming Events
              </Link>
              <Link to="/create-event" className="btn btn-outline">
                Create an Event
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 text-xs md:text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span>Real-time event updates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-info"></span>
                <span>Manage events you created</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                <span>Track events you joined</span>
              </div>
            </div>
          </div>

          {/* Right side: simple modern visual */}
          <div className="flex-1 w-full">
            <div className="relative max-w-md mx-auto">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 blur-3xl absolute inset-0" />
              <div className="relative grid grid-cols-2 gap-4">
                <SectionCard
                  title="Clean-up Campaigns"
                  subtitle="Environment"
                  icon={<span>🧹</span>}
                >
                  Coordinate neighborhood clean-up drives with volunteers and
                  track participation.
                </SectionCard>
                <SectionCard
                  title="Health & Awareness"
                  subtitle="Community"
                  icon={<span>💉</span>}
                  accent="secondary"
                >
                  Organize health camps and awareness sessions that educate and
                  support people.
                </SectionCard>
                <SectionCard
                  title="Charity Events"
                  subtitle="Support"
                  icon={<span>🤝</span>}
                  accent="accent"
                >
                  Plan charity events and fundraisers to help those in need.
                </SectionCard>
                <SectionCard
                  title="Volunteer Network"
                  subtitle="Impact"
                  icon={<span>🌍</span>}
                >
                  Build your volunteer profile by joining more events and
                  campaigns.
                </SectionCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Feature Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold">
            Everything You Need in One Platform
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-base-content/70">
            Our application makes it simple to create events, discover new
            opportunities, and keep track of your social impact journey.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <SectionCard
            title="Create Events Easily"
            subtitle="Event Management"
            icon={<span>📝</span>}
          >
            Add title, description, date, location, and event type with a simple
            form. Your event becomes discoverable to others instantly.
          </SectionCard>

          <SectionCard
            title="Join &amp; Track Events"
            subtitle="Your Activity"
            icon={<span>📅</span>}
            accent="secondary"
          >
            Join events that matter to you and see all your joined events in a
            dedicated page, sorted by date.
          </SectionCard>

          <SectionCard
            title="Manage Your Campaigns"
            subtitle="Organizer Tools"
            icon={<span>⚙️</span>}
            accent="accent"
          >
            Edit event details, update information, and keep participants
            up-to-date with the latest changes.
          </SectionCard>
        </div>
      </section>

      {/* 🔹 Gallery Section – now from database */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Event Highlights</h2>
            <p className="text-sm md:text-base text-base-content/70 max-w-xl">
              A glimpse of real upcoming events created by the community using
              this platform.
            </p>
          </div>
          <Link
            to="/upcoming-events"
            className="btn btn-outline btn-sm md:btn-md"
          >
            View All Events
          </Link>
        </div>

        {galleryLoading ? (
          <div className="min-h-[120px] flex items-center justify-center">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : galleryError ? (
          <p className="text-xs text-red-500">
            Failed to load event gallery: {galleryError}
          </p>
        ) : galleryEvents.length === 0 ? (
          <p className="text-sm text-base-content/70">
            No upcoming events to display yet. Be the first to create one!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryEvents.map((event) => (
              <div
                key={event._id}
                className="group overflow-hidden rounded-2xl border bg-base-100 shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="relative h-40 md:h-48 bg-base-200 overflow-hidden">
                  {event.thumbnail ? (
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-base-content/60">
                      No image available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="badge badge-sm badge-outline border-base-100 text-base-100">
                      {event.eventType}
                    </span>
                    <span className="text-[11px] text-base-100/80">
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-xs md:text-sm text-base-content/70 line-clamp-2">
                    {event.location}
                  </p>
                  <div className="mt-3">
                    <Link
                      to={`/event/${event._id}`}
                      className="btn btn-sm btn-outline w-full"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🔹 Newsletter / Stay Updated Section */}
      <section className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-base-200 border shadow-sm p-6 md:p-8 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Stay Updated with Upcoming Events
            </h2>
            <p className="text-sm md:text-base text-base-content/70 max-w-xl">
              Subscribe with your email to receive updates about new social
              development events and opportunities in your area.
            </p>
          </div>

          <form
            className="mt-2 grid gap-3 md:grid-cols-[2fr,auto]"
            onSubmit={handleSubscribe}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-full md:w-auto">
              Subscribe
            </button>
          </form>

          <p className="text-xs text-base-content/60">
            No spam. We only send updates related to social development events.
            You can unsubscribe any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
