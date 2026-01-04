import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionCard from "../components/SectionCard";
import toast from "react-hot-toast";
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaHeart, FaChartLine, FaHandsHelping } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const [galleryEvents, setGalleryEvents] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [email, setEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, totalJoined: 0 });

  // Handle category click - redirect to explore events with filter
  const handleCategoryClick = (eventType) => {
    navigate(`/upcoming-events?type=${encodeURIComponent(eventType)}`);
  };

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
    
    // Refresh stats every 30 seconds
    const statsInterval = setInterval(() => {
      fetch(`${import.meta.env.VITE_API_URL}/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setStats(data);
          }
        })
        .catch(err => console.error("Failed to refresh stats:", err));
    }, 30000);

    return () => clearInterval(statsInterval);
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

      {/* 2. Event Highlights / Gallery Section - Moved right after Hero */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event Highlights
            </h2>
            <p className="text-base text-base-content/70 max-w-xl mt-2">
              A glimpse of real upcoming events created by the community using
              this platform.
            </p>
          </div>
          <Link
            to="/upcoming-events"
            className="btn btn-primary btn-sm md:btn-md shadow-lg hover:shadow-xl transition-all"
          >
            View All Events
          </Link>
        </motion.div>

        {galleryLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-consistent bg-base-100 border-2 border-base-300 rounded-2xl overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                  <div className="h-4 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />
                  <div className="h-8 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded mt-2" />
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryEvents.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-consistent group overflow-hidden rounded-2xl border-2 border-base-300 bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
              >
                <div className="relative h-52 bg-base-200 overflow-hidden">
                  {event.thumbnail && event.thumbnail.trim() !== "" ? (
                    <>
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-sm text-base-content/60 bg-gradient-to-br from-base-300 to-base-200">
                        <div className="text-center">
                          <p className="font-semibold">{event.eventType}</p>
                          <p className="text-xs mt-1">Image unavailable</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60 bg-gradient-to-br from-base-300 to-base-200">
                      <div className="text-center">
                        <p className="font-semibold">{event.eventType}</p>
                        <p className="text-xs mt-1">No image available</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                    <span className="badge badge-lg bg-primary text-primary-content border-0 shadow-xl backdrop-blur-sm">
                      {event.eventType}
                    </span>
                    <div className="badge badge-sm bg-base-100/95 text-base-content border-0 shadow-lg backdrop-blur-sm">
                      <FaCalendarAlt className="mr-1 text-xs" />
                      {event.eventDate
                        ? new Date(event.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-3 flex-1 flex flex-col min-h-[200px]">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                    {event.title}
                  </h3>
                  <p className="text-sm text-base-content/70 line-clamp-2 flex items-start gap-2 min-h-[2.5rem]">
                    <FaMapMarkerAlt className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </p>
                  <div className="mt-auto pt-2">
                    <Link
                      to={`/event/${event._id}`}
                      className="btn btn-primary btn-sm w-full shadow-md hover:shadow-lg transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Statistics Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 md:p-12 border-2 border-primary/20 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Platform Statistics
          </h2>
          <p className="text-base-content/70">Real-time data from our community</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: FaCalendarAlt, value: stats.totalEvents, label: "Total Events", color: "primary" },
            { icon: FaUsers, value: stats.totalUsers, label: "Active Users", color: "secondary" },
            { icon: FaHeart, value: stats.totalJoined, label: "Event Participations", color: "accent" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-base-100 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all border-2 border-${stat.color}/20 hover:border-${stat.color}/40 hover:-translate-y-1`}
            >
              <stat.icon className={`text-4xl text-${stat.color} mx-auto mb-3`} />
              <div className={`text-3xl md:text-4xl font-bold text-${stat.color} mb-2`}>
                {stat.value}+
              </div>
              <p className="text-base-content/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Features Section */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Everything You Need in One Platform
          </h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Our application makes it simple to create events, discover new
            opportunities, and keep track of your social impact journey.
          </p>
        </motion.div>

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

      {/* 5. Services Section */}
      <section className="bg-base-200 rounded-3xl p-8 md:p-12 space-y-8 border-2 border-base-300 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Comprehensive tools and features to support your community engagement
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FaHandsHelping, title: "Event Discovery", desc: "Browse and filter events by type, date, and location", color: "primary" },
            { icon: FaChartLine, title: "Analytics Dashboard", desc: "Track your participation and impact with detailed insights", color: "secondary" },
            { icon: FaMapMarkerAlt, title: "Location-Based", desc: "Find events near you with location-based search", color: "accent" },
            { icon: FaUsers, title: "Community Building", desc: "Connect with like-minded volunteers and organizers", color: "primary" },
          ].map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-base-100 rounded-2xl p-6 text-center border-2 border-${service.color}/20 hover:border-${service.color}/40 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
            >
              <service.icon className={`text-3xl text-${service.color} mx-auto mb-3`} />
              <h3 className="font-semibold mb-2">{service.title}</h3>
              <p className="text-sm text-base-content/70">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. Categories Section */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Event Categories
          </h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Explore different types of social development events
          </p>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { type: "Cleanup", icon: "🧹", desc: "Community clean-up drives and environmental initiatives" },
            { type: "Plantation", icon: "🌳", desc: "Tree planting and green space development" },
            { type: "Donation", icon: "🤝", desc: "Charity events and donation campaigns" },
            { type: "Awareness", icon: "📢", desc: "Educational and awareness programs" },
            { type: "Health Camp", icon: "💉", desc: "Health checkups and medical camps" },
            { type: "Other", icon: "🌟", desc: "Various other community development activities" }
          ].map((cat, index) => (
            <motion.button
              key={cat.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleCategoryClick(cat.type)}
              className="bg-gradient-to-br from-base-200 to-base-100 rounded-2xl p-6 border-2 border-base-300 hover:border-primary/40 hover:shadow-xl transition-all hover:scale-105 hover:-translate-y-1 text-left group cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{cat.type}</h3>
              <p className="text-sm text-base-content/70">{cat.desc}</p>
              <div className="mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                Explore events →
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 border-2 border-secondary/20 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            What Our Community Says
          </h2>
          <p className="text-base-content/70">Real feedback from volunteers and organizers</p>
        </motion.div>
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-base-100 rounded-2xl p-6 shadow-xl border-2 border-base-300 hover:border-secondary/40 hover:shadow-2xl transition-all hover:-translate-y-1"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-accent text-lg">⭐</span>
                ))}
              </div>
              <p className="text-base-content/80 mb-4 italic text-base leading-relaxed">"{testimonial.text}"</p>
              <div className="pt-3 border-t border-base-300">
                <p className="font-semibold text-primary">{testimonial.name}</p>
                <p className="text-sm text-base-content/60">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. How It Works Section */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="max-w-2xl mx-auto text-base text-base-content/70">
            Get started in three simple steps
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Create Account", desc: "Sign up with your email or use Google login to get started quickly", color: "primary" },
            { step: "2", title: "Browse or Create", desc: "Explore upcoming events or create your own social development event", color: "secondary" },
            { step: "3", title: "Join & Track", desc: "Join events that interest you and track your participation in your dashboard", color: "accent" }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-base-200 to-base-100 rounded-2xl p-6 text-center border-2 border-${item.color}/20 hover:border-${item.color}/40 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${item.color} to-${item.color}/80 text-${item.color}-content text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-base-content/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. FAQ Section */}
      <section className="bg-base-200 rounded-3xl p-8 md:p-12 space-y-6 border-2 border-base-300 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-base-content/70">Find answers to common questions</p>
        </motion.div>
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
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-base-100 rounded-2xl p-6 border-2 border-base-300 hover:border-primary/40 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <h3 className="font-semibold text-lg mb-2 text-primary">{faq.q}</h3>
              <p className="text-base-content/70 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 10. Newsletter / Stay Updated Section */}
      <section className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 shadow-xl p-6 md:p-8 space-y-4"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
            <button type="submit" className="btn btn-primary w-full md:w-auto shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Subscribe
            </button>
          </form>

          <p className="text-xs text-center text-base-content/60">
            No spam. We only send updates related to social development events.
            You can unsubscribe any time.
          </p>
        </motion.div>
      </section>

      {/* 11. CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-8 md:p-12 text-center text-base-100 shadow-2xl border-2 border-white/20"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-base-100/90 mb-6 max-w-2xl mx-auto">
          Join thousands of volunteers and organizers creating positive change in their communities
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            Get Started
          </Link>
          <Link to="/upcoming-events" className="btn btn-lg btn-outline border-2 border-base-100 text-base-100 hover:bg-base-100/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            Explore Events
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
