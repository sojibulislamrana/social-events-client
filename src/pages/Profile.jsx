import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaCamera } from "react-icons/fa";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-base-content/70">
          Manage your account information and preferences
        </p>
      </div>

      <div className="bg-base-100 rounded-2xl p-6 md:p-8 shadow-lg">
        {/* Profile Picture Preview */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {formData.photoURL ? (
              <img
                src={formData.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary text-primary-content flex items-center justify-center text-4xl font-bold border-4 border-primary">
                {formData.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
            )}
            <div className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full p-2">
              <FaCamera className="text-sm" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaUser /> Full Name
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={formData.displayName}
              onChange={(e) => handleChange("displayName", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email (Read-only) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaEnvelope /> Email Address
              </span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full bg-base-200"
              value={user?.email || ""}
              disabled
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Email cannot be changed
              </span>
            </label>
          </div>

          {/* Photo URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium flex items-center gap-2">
                <FaCamera /> Profile Photo URL
              </span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              value={formData.photoURL}
              onChange={(e) => handleChange("photoURL", e.target.value)}
              placeholder="https://example.com/your-photo.jpg"
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Enter a public image URL for your profile picture
              </span>
            </label>
          </div>

          {/* Account Info */}
          <div className="bg-base-200 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold">Account Information</h3>
            <div className="text-sm text-base-content/70 space-y-1">
              <p>
                <span className="font-medium">User ID:</span> {user?.uid || "N/A"}
              </p>
              <p>
                <span className="font-medium">Account Created:</span>{" "}
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-medium">Last Sign In:</span>{" "}
                {user?.metadata?.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  displayName: user?.displayName || "",
                  photoURL: user?.photoURL || "",
                });
              }}
              className="btn btn-ghost"
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

