import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaEye, FaCalendarAlt, FaSpinner, FaCheckCircle } from "react-icons/fa";
import Spinner from "../components/Spinner";

const ManageEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState("");

  const loadEvents = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/events/user?email=${encodeURIComponent(
          user.email
        )}`
      );
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to load your events.");
      }

      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user?.email]);

  const startEdit = (event) => {
    setEditingId(event._id);
    setFormValues({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().slice(0, 10)
        : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormValues({});
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async (id) => {
    if (!user?.email) {
      toast.error("You must be logged in.");
      return;
    }

    const { title, description, eventType, thumbnail, location, eventDate } =
      formValues;

    if (
      !title ||
      !description ||
      !eventType ||
      !thumbnail ||
      !location ||
      !eventDate
    ) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          // convert YYYY-MM-DD to ISO for server
          eventDate: new Date(eventDate).toISOString(),
          requestorEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to update event.");
      }

      toast.success("Event updated successfully! ✨");
      cancelEdit();
      loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update event.");
    }
  };

  const handleDelete = async (id, title) => {
    if (!user?.email) {
      toast.error("You must be logged in.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestorEmail: user.email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to delete event.");
      }

      toast.success("Event deleted successfully! 🗑️");
      loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to delete event.");
    }
  };

  if (!user?.email) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-sm text-base-content/70">
          Please log in to manage your events.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-base-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-base-200 rounded-3xl p-6 animate-pulse">
              <div className="h-6 bg-base-300 rounded w-3/4 mb-4" />
              <div className="h-4 bg-base-300 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <FaCalendarAlt className="text-base-100 text-lg" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Manage My Events
          </h1>
        </div>
        <p className="text-sm md:text-base text-base-content/70">
          View, update, and delete events you have created.
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-500">
          Error loading your events: {error}
        </p>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-base-content/70">
          You have not created any events yet.
        </p>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const isEditing = editingId === event._id;

            return (
              <div
                key={event._id}
                className="bg-base-200 rounded-3xl p-4 md:p-5 flex flex-col gap-3"
              >
                {isEditing ? (
                  <>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs md:text-sm">
                            Title
                          </span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered input-sm md:input-md"
                          value={formValues.title}
                          onChange={(e) =>
                            handleChange("title", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs md:text-sm">
                            Event Type
                          </span>
                        </label>
                        <select
                          className="select select-bordered select-sm md:select-md"
                          value={formValues.eventType}
                          onChange={(e) =>
                            handleChange("eventType", e.target.value)
                          }
                        >
                          <option value="">Select type</option>
                          <option value="Cleanup">Cleanup</option>
                          <option value="Plantation">Plantation</option>
                          <option value="Donation">Donation</option>
                          <option value="Awareness">Awareness</option>
                          <option value="Health Camp">Health Camp</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs md:text-sm">
                            Thumbnail URL
                          </span>
                        </label>
                        <input
                          type="url"
                          className="input input-bordered input-sm md:input-md"
                          value={formValues.thumbnail}
                          onChange={(e) =>
                            handleChange("thumbnail", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-xs md:text-sm">
                            Date
                          </span>
                        </label>
                        <input
                          type="date"
                          className="input input-bordered input-sm md:input-md"
                          value={formValues.eventDate}
                          onChange={(e) =>
                            handleChange("eventDate", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs md:text-sm">
                          Location
                        </span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered input-sm md:input-md"
                        value={formValues.location}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-xs md:text-sm">
                          Description
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered textarea-sm md:textarea-md"
                        value={formValues.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2">
                      <button
                        className="btn btn-primary btn-sm md:btn-md"
                        onClick={() => handleUpdate(event._id)}
                      >
                        Save Changes
                      </button>
                      <button
                        className="btn btn-ghost btn-sm md:btn-md"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-outline">
                            {event.eventType}
                          </span>
                          <span className="text-xs text-base-content/60">
                            {event.eventDate
                              ? new Date(event.eventDate).toLocaleDateString()
                              : ""}
                          </span>
                        </div>
                        <h2 className="font-semibold text-sm md:text-base">
                          {event.title}
                        </h2>
                        <p className="text-xs md:text-sm text-base-content/70">
                          {event.location}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`/event/${event._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost btn-sm"
                          title="View Event"
                        >
                          <FaEye />
                        </a>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => startEdit(event)}
                          title="Edit Event"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleDelete(event._id, event.title)}
                          title="Delete Event"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-base-content/70 line-clamp-3">
                      {event.description}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
