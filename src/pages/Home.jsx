import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import toast from "react-hot-toast";
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaHeart, FaChartLine, FaHandsHelping } from "react-icons/fa";

const Home = () => {
  const [galleryEvents, setGalleryEvents] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [email, setEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, totalJoined: 0 });

  // Hero carousel slides
  const heroSlides = [
    {
      title: "Transform Your Community",
      subtitle: "Join hands with thousands of volunteers making a difference",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200",
      cta: "Explore Events",
      link: "/upcoming-events"
    },
    {
      title: "Create Impactful Events",
      subtitle: "Organize clean-up drives, awareness programs, and charity events",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200",
      cta: "Create Event",
      link: "/create-event"
    },
    {
      title: "Track Your Social Impact",
      subtitle: "Monitor all events you've joined and your contribution to society",
      image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200",
      cta: "View Dashboard",
      link: "/dashboard"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load gallery events and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setGalleryLoading(true);
        const [eventsRes, statsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/events/upcoming`),
          fetch(`${import.meta.env.VITE_API_URL}/stats`)
        ]);

        const eventsData = await eventsRes.json();
        if (eventsRes.ok && eventsData.ok) {
          setGalleryEvents((eventsData.events || []).slice(0, 6));
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.ok) {
            setStats(statsData);
          }
        }
      } catch (err) {
        console.error(err);
        setGalleryError(err.message);
      } finally {
        setGalleryLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailPattern = /\S+@\S+\.\S+/;
    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You are now subscribed to event updates!");
    setEmail("");
  };

  return (
    <div className="space-y-12 md:space-y-20">
      {/* 1. Hero / Carousel Section */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-secondary/80" />
            </div>
            <div className="relative h-full flex items-center justify-center text-center px-4">
              <div className="max-w-4xl space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-base-100">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-base-100/90">
                  {slide.subtitle}
                </p>
                <Link
                  to={slide.link}
                  className="btn btn-lg bg-base-100 text-primary hover:bg-base-200"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-base-100 w-8"
                  : "bg-base-100/50 hover:bg-base-100/75"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <svg
            className="w-6 h-6 text-base-100"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* 2. Statistics Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Platform Statistics</h2>
          <p className="text-base-content/70">Real-time data from our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-lg">
            <FaCalendarAlt className="text-4xl text-primary mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {stats.totalEvents}+
            </div>
            <p className="text-base-content/70">Total Events</p>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-lg">
            <FaUsers className="text-4xl text-secondary mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              {stats.totalUsers}+
            </div>
            <p className="text-base-content/70">Active Users</p>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center shadow-lg">
            <FaHeart className="text-4xl text-accent mx-auto mb-3" />
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
              {stats.totalJoined}+
            </div>
            <p className="text-base-content/70">Event Participations</p>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need in One Platform
          </h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
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
            title="Join & Track Events"
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

      {/* 4. Services Section */}
      <section className="bg-base-200 rounded-3xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Comprehensive tools and features to support your community engagement
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-base-100 rounded-2xl p-6 text-center">
            <FaHandsHelping className="text-3xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Event Discovery</h3>
            <p className="text-sm text-base-content/70">
              Browse and filter events by type, date, and location
            </p>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center">
            <FaChartLine className="text-3xl text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-base-content/70">
              Track your participation and impact with detailed insights
            </p>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center">
            <FaMapMarkerAlt className="text-3xl text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Location-Based</h3>
            <p className="text-sm text-base-content/70">
              Find events near you with location-based search
            </p>
          </div>
          <div className="bg-base-100 rounded-2xl p-6 text-center">
            <FaUsers className="text-3xl text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Community Building</h3>
            <p className="text-sm text-base-content/70">
              Connect with like-minded volunteers and organizers
            </p>
          </div>
        </div>
      </section>

      {/* 5. Categories Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Event Categories</h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Explore different types of social development events
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { type: "Cleanup", icon: "🧹", desc: "Community clean-up drives and environmental initiatives" },
            { type: "Plantation", icon: "🌳", desc: "Tree planting and green space development" },
            { type: "Donation", icon: "🤝", desc: "Charity events and donation campaigns" },
            { type: "Awareness", icon: "📢", desc: "Educational and awareness programs" },
            { type: "Health Camp", icon: "💉", desc: "Health checkups and medical camps" },
            { type: "Other", icon: "🌟", desc: "Various other community development activities" }
          ].map((cat) => (
            <div
              key={cat.type}
              className="bg-base-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{cat.type}</h3>
              <p className="text-sm text-base-content/70">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Event Highlights / Gallery Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Event Highlights</h2>
            <p className="text-base text-base-content/70 max-w-xl mt-2">
              A glimpse of real upcoming events created by the community using
              this platform.
            </p>
          </div>
          <Link
            to="/upcoming-events"
            className="btn btn-primary btn-sm md:btn-md"
          >
            View All Events
          </Link>
        </div>

        {galleryLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-consistent bg-base-200 animate-pulse">
                <div className="h-48 bg-base-300" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-base-300 rounded w-3/4" />
                  <div className="h-3 bg-base-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : galleryError ? (
          <p className="text-sm text-error">Failed to load events: {galleryError}</p>
        ) : galleryEvents.length === 0 ? (
          <p className="text-base text-base-content/70 text-center py-8">
            No upcoming events to display yet. Be the first to create one!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryEvents.map((event) => (
              <div
                key={event._id}
                className="card-consistent group overflow-hidden rounded-2xl border bg-base-100 shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative h-48 bg-base-200 overflow-hidden">
                  {event.thumbnail ? (
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
                      No image available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="badge badge-sm badge-outline border-base-100 text-base-100">
                      {event.eventType}
                    </span>
                    <span className="text-xs text-base-100/80">
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-base-content/70 line-clamp-2">
                    {event.location}
                  </p>
                  <div className="mt-auto pt-2">
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

      {/* 7. Testimonials Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Community Says</h2>
          <p className="text-base-content/70">Real feedback from volunteers and organizers</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Sarah Johnson",
              role: "Community Organizer",
              text: "This platform has made it so easy to organize and manage our local clean-up events. Highly recommended!",
              rating: 5
            },
            {
              name: "Michael Chen",
              role: "Volunteer",
              text: "I've discovered so many meaningful events through this platform. It's become an essential tool for my community involvement.",
              rating: 5
            },
            {
              name: "Emily Rodriguez",
              role: "NGO Coordinator",
              text: "The dashboard and analytics features help us track our impact effectively. Great platform for social development!",
              rating: 5
            }
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-base-100 rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-accent">⭐</span>
                ))}
              </div>
              <p className="text-base-content/80 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-base-content/60">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. How It Works Section */}
      <section className="space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Create Account", desc: "Sign up with your email or use Google login to get started quickly" },
            { step: "2", title: "Browse or Create", desc: "Explore upcoming events or create your own social development event" },
            { step: "3", title: "Join & Track", desc: "Join events that interest you and track your participation in your dashboard" }
          ].map((item) => (
            <div key={item.step} className="bg-base-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-content text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-base-content/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="bg-base-200 rounded-3xl p-8 md:p-12 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-base-content/70">Find answers to common questions</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "How do I create an event?",
              a: "Simply log in, click 'Create Event', fill in the details including title, description, date, location, and event type, then submit. Your event will be visible to all users immediately."
            },
            {
              q: "Can I edit or delete my events?",
              a: "Yes, you can edit any event you've created from the 'Manage Events' page. However, deletion functionality may vary based on your account type."
            },
            {
              q: "Is there a mobile app?",
              a: "Currently, we offer a fully responsive web application that works seamlessly on mobile devices. A dedicated mobile app may be available in the future."
            },
            {
              q: "How do I join an event?",
              a: "Browse the 'Explore Events' page, click on any event that interests you, and click the 'Join Event' button on the event details page."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-base-100 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-base-content/70">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Newsletter / Stay Updated Section */}
      <section className="max-w-3xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border shadow-sm p-6 md:p-8 space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-bold">
              Stay Updated with Upcoming Events
            </h2>
            <p className="text-base text-base-content/70 max-w-xl mx-auto">
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

          <p className="text-xs text-center text-base-content/60">
            No spam. We only send updates related to social development events.
            You can unsubscribe any time.
          </p>
        </div>
      </section>

      {/* 11. CTA Section */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-8 md:p-12 text-center text-base-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-base-100/90 mb-6 max-w-2xl mx-auto">
          Join thousands of volunteers and organizers creating positive change in their communities
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn btn-lg bg-base-100 text-primary hover:bg-base-200">
            Get Started
          </Link>
          <Link to="/upcoming-events" className="btn btn-lg btn-outline border-base-100 text-base-100 hover:bg-base-100/20">
            Explore Events
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
