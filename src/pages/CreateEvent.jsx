import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaImage,
  FaFileAlt,
  FaTag,
  FaPlusCircle,
  FaSpinner,
  FaCheckCircle,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Handle image file upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setThumbnailFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result);
      // Store base64 string
      setThumbnail(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setThumbnailFile(null);
    setThumbnailPreview("");
    setThumbnail("");
  };

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

    if (!thumbnail && !thumbnailPreview) {
      toast.error("Please upload an image or provide an image URL.");
      return;
    }

    const now = new Date();
    const selected = new Date(eventDate);
    if (selected <= now) {
      toast.error("Event date must be in the future.");
      return;
    }

    // Use uploaded image (base64) or URL
    const imageData = thumbnailPreview || thumbnail;

    const eventData = {
      title,
      description,
      eventType,
      thumbnail: imageData, // This will be base64 string if uploaded, or URL if provided
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

      toast.success("Event created successfully! 🎉");
      setTimeout(() => {
        navigate("/upcoming-events");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <FaPlusCircle className="text-2xl text-base-100" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create New Event
          </h1>
        </div>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Fill in the details below to create a social development event. Make sure to choose a future date for the event.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-base-100 rounded-3xl border-2 border-base-300 shadow-xl p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title + Type */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaFileAlt className="text-primary" />
                  Event Title
                </span>
              </label>
              <input
                type="text"
                placeholder="Community Clean-up at City Park"
                className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaTag className="text-primary" />
                  Event Type
                </span>
              </label>
              <select
                className="select select-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
              >
                <option value="">Select type</option>
                <option value="Cleanup">🧹 Cleanup</option>
                <option value="Plantation">🌳 Plantation</option>
                <option value="Donation">🤝 Donation</option>
                <option value="Awareness">📢 Awareness</option>
                <option value="Health Camp">💉 Health Camp</option>
                <option value="Other">🌟 Other</option>
              </select>
            </div>
          </div>

          {/* Thumbnail + Location */}
          <div className="grid gap-5 md:grid-cols-[2fr,1.5fr]">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaImage className="text-primary" />
                  Event Image
                </span>
              </label>
              
              {/* Image Upload */}
              {!thumbnailPreview ? (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer bg-base-200 hover:bg-base-300 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaUpload className="w-8 h-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      <p className="mb-2 text-sm text-base-content/70">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-base-content/60">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  
                  <div className="divider text-xs">OR</div>
                  
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                  />
                  <label className="label">
                    <span className="label-text-alt text-xs text-base-content/60">
                      Enter image URL if you prefer
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-primary/30">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 btn btn-circle btn-sm btn-error shadow-lg"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <p className="text-xs text-base-content/60 mt-2 text-center">
                    Image ready to upload
                  </p>
                </div>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  Location
                </span>
              </label>
              <input
                type="text"
                placeholder="City Park, Main Gate"
                className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Event Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <FaCalendarAlt className="text-primary" />
                Event Date & Time
              </span>
            </label>
            <DatePicker
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholderText="Select event date and time"
              minDate={new Date()}
              wrapperClassName="w-full"
            />
            <label className="label">
              <span className="label-text-alt text-xs text-base-content/60">
                Event must be scheduled for a future date and time
              </span>
            </label>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <FaFileAlt className="text-primary" />
                Description
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full min-h-[150px] rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Describe the purpose, schedule, and any important details about the event..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Organizer Info */}
          <div className="bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl p-4 border border-primary/20 dark:border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <FaCheckCircle className="text-secondary" />
              <span className="font-semibold text-sm">Organizer Information</span>
            </div>
            <p className="text-sm text-base-content/70">
              <span className="font-medium">Email:</span> {user?.email || "Not available"}
            </p>
            <p className="text-xs text-base-content/60 mt-1">
              Your email will be associated with this event as the organizer.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-auto min-w-[200px] h-12 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Creating Event...
                </>
              ) : (
                <>
                  <FaPlusCircle />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateEvent;
