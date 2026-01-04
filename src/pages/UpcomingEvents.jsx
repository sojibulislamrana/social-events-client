import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaFilter, FaSort, FaMapMarkerAlt, FaCalendarAlt, FaEye, FaTimes } from "react-icons/fa";
import CountdownTimer from "../components/CountdownTimer";
import Spinner from "../components/Spinner";

const UpcomingEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter and search states - initialize from URL
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState(searchParams.get("type") || "");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 12;

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
        setEvents(data.events || []);
        setFilteredEvents(data.events || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Get unique values for filters
  const eventTypes = [...new Set(events.map(e => e.eventType))].sort();
  const locations = [...new Set(events.map(e => e.location))].sort();

  // Apply filters and search
  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Event type filter
    if (eventTypeFilter) {
      filtered = filtered.filter((event) => event.eventType === eventTypeFilter);
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter((event) => event.location === locationFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.eventDate) - new Date(b.eventDate);
        case "date-desc":
          return new Date(b.eventDate) - new Date(a.eventDate);
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [events, searchQuery, eventTypeFilter, locationFilter, sortBy]);

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const resetFilters = () => {
    setSearchQuery("");
    setEventTypeFilter("");
    setLocationFilter("");
    setSortBy("date-asc");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-base-200 rounded animate-pulse" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-consistent bg-base-100 border-2 border-base-300 rounded-2xl overflow-hidden">
              <div className="h-52 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-3/4" />
                <div className="h-4 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-1/2" />
                <div className="h-3 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-full" />
                <div className="h-3 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded w-2/3" />
                <div className="h-8 bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-shimmer rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-error text-sm">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary btn-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Explore Events
          </h1>
          <p className="text-base text-base-content/70">
            Discover and join upcoming social development events in your community
          </p>
        </div>
        <Link to="/create-event" className="btn btn-primary btn-sm md:btn-md">
          + Create Event
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 rounded-2xl p-4 md:p-6 space-y-4">
        {/* Search Bar */}
        <div className="form-control">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              className="input input-bordered w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Event Type Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium flex items-center gap-2">
                <FaFilter /> Event Type
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium flex items-center gap-2">
                <FaFilter /> Location
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-sm font-medium flex items-center gap-2">
                <FaSort /> Sort By
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-asc">Date (Earliest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Reset Filters */}
        {(searchQuery || eventTypeFilter || locationFilter) && (
          <button
            onClick={resetFilters}
            className="btn btn-ghost btn-sm gap-2"
          >
            <FaTimes />
            <FaTimes className="text-xs" />
            Clear Filters
          </button>
        )}

        {/* Results Count */}
        <div className="text-sm text-base-content/70 flex items-center gap-2">
          <FaCalendarAlt className="text-primary" />
          <span>
            Showing <span className="font-semibold text-primary">{filteredEvents.length}</span> of{" "}
            <span className="font-semibold">{events.length}</span> events
          </span>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base text-base-content/70 mb-4">
            {events.length === 0
              ? "No upcoming events found. Be the first to create one!"
              : "No events match your filters. Try adjusting your search criteria."}
          </p>
          {events.length > 0 && (
            <button onClick={resetFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentEvents.map((event) => (
              <div
                key={event._id}
                className="card-consistent group overflow-hidden rounded-2xl border-2 border-base-300 bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-52 bg-base-200 overflow-hidden flex-shrink-0">
                  {event.thumbnail ? (
                    <img
                      src={event.thumbnail}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60 bg-gradient-to-br from-base-300 to-base-200">
                      No image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                    <span className="badge badge-lg bg-primary text-primary-content border-0 shadow-xl backdrop-blur-sm">
                      {event.eventType}
                    </span>
                    <div className="badge badge-sm bg-base-100/95 text-base-content border-0 shadow-lg backdrop-blur-sm">
                      <FaCalendarAlt className="mr-1" />
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
                  <h2 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                    {event.title}
                  </h2>
                  <p className="text-sm text-base-content/70 line-clamp-2 flex items-start gap-2 min-h-[2.5rem]">
                    <FaMapMarkerAlt className="text-secondary mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </p>
                  <p className="text-xs text-base-content/60 line-clamp-2 flex-1">
                    {event.description}
                  </p>
                  
                  {/* Countdown Timer - Compact Single Line */}
                  {event.eventDate && (
                    <div className="py-2 border-t border-base-300 flex-shrink-0">
                      <CountdownTimer eventDate={event.eventDate} compact />
                    </div>
                  )}
                  
                  <div className="mt-auto pt-2 flex-shrink-0">
                    <Link
                      to={`/event/${event._id}`}
                      className="btn btn-primary btn-sm w-full shadow-md hover:shadow-lg transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-sm btn-outline"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`btn btn-sm ${
                          currentPage === page
                            ? "btn-primary"
                            : "btn-outline"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="btn btn-sm btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingEvents;
