// src/pages/CreateEvent.jsx
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("You must be logged in to create an event.");
      return;
    }

    if (!eventDate) {
      toast.error("Please select an event date.");
      return;
    }

    const now = new Date();
    // remove time from comparison to be safe, but still enforce future
    const selected = new Date(eventDate);
    if (selected <= now) {
      toast.error("Event date must be in the future.");
      return;
    }

    const eventData = {
      title,
      description,
      eventType,
      thumbnail,
      location,
      eventDate: selected.toISOString(),
      creatorEmail: user.email,
    };

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to create event.");
      }

      toast.success("Event created successfully!");
      // redirect to Upcoming Events after success
      navigate("/upcoming-events");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-base-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Create a New Event
          </h1>
          <p className="text-sm md:text-base text-base-content/70">
            Fill in the details below to create a social development event. Make
            sure to choose a future date for the event.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title + Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Event Title</span>
              </label>
              <input
                type="text"
                placeholder="Community Clean-up at City Park"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Event Type</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
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

          <div className="grid gap-4 md:grid-cols-[2fr,1.5fr]">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Thumbnail Image URL
                </span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/event-image.jpg"
                className="input input-bordered w-full"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                required
              />
              <span className="label-text-alt text-xs mt-1 text-base-content/60">
                Use a public image URL to represent your event.
              </span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Location</span>
              </label>
              <input
                type="text"
                placeholder="City Park, Main Gate"
                className="input input-bordered w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control max-w-xs">
            <label className="label">
              <span className="label-text font-medium">Event Date</span>
            </label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              className="input input-bordered w-full"
              placeholderText="Select event date"
              minDate={new Date()} // prevent selecting past dates in UI
              dateFormat="dd MMM yyyy"
            />
            <span className="label-text-alt text-xs mt-1 text-base-content/60">
              You cannot select any past date. Event must happen in the future.
            </span>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full min-h-[120px]"
              placeholder="Describe the purpose, schedule, and any important details about the event."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Info about creator */}
          <div className="text-xs md:text-sm text-base-content/70">
            <p>
              <span className="font-medium">Organizer Email:</span>{" "}
              {user?.email || "Not available"}
            </p>
            <p>
              The email of the logged-in user will be stored with this event
              data to identify the creator.
            </p>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto"
              disabled={loading}
            >
              {loading ? "Creating event..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
