import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaSave,
  FaUndo,
  FaIdCard,
  FaCalendarCheck,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Spinner from "../components/Spinner";

const Profile = () => {
  const { user, userRole } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const original = {
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    };
    setHasChanges(
      formData.displayName !== original.displayName ||
      formData.photoURL !== original.photoURL
    );
  }, [formData, user]);

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
      toast.success("Profile updated successfully! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    toast.info("Changes reset");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-base-content/70">
            Manage your account information and preferences
          </p>
        </div>
        {/* Role Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          {userRole === "admin" ? (
            <>
              <FaShieldAlt className="text-accent" />
              <span className="font-semibold">Administrator</span>
            </>
          ) : (
            <>
              <FaUser className="text-primary" />
              <span className="font-semibold">User</span>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Profile Picture */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-base-100 rounded-3xl border-2 border-base-300 shadow-xl p-6 sticky top-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {formData.photoURL ? (
                  <img
                    src={formData.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary text-base-100 flex items-center justify-center text-5xl font-bold border-4 border-primary shadow-lg">
                    {formData.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-primary text-primary-content rounded-full p-3 shadow-lg border-4 border-base-100">
                  <FaCamera className="text-sm" />
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{formData.displayName || "User"}</h2>
                <p className="text-sm text-base-content/60">{user?.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-base-100 rounded-3xl border-2 border-base-300 shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Display Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaUser className="text-primary" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={formData.displayName}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Email (Read-only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaEnvelope className="text-primary" />
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full h-12 rounded-xl bg-base-200 cursor-not-allowed"
                  value={user?.email || ""}
                  disabled
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/60 flex items-center gap-1">
                    <FaShieldAlt className="text-xs" />
                    Email cannot be changed
                  </span>
                </label>
              </div>

              {/* Photo URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaCamera className="text-primary" />
                    Profile Photo URL
                  </span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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

              {/* Account Info Card */}
              <div className="bg-base-200 rounded-xl p-5 border border-base-300 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <FaIdCard className="text-primary" />
                  <h3 className="font-semibold">Account Information</h3>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">User ID</p>
                    <p className="text-sm font-mono text-base-content/80 break-all">
                      {user?.uid || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 mb-1 flex items-center gap-1">
                      <FaCalendarCheck />
                      Account Created
                    </p>
                    <p className="text-sm text-base-content/80">
                      {user?.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">Last Sign In</p>
                    <p className="text-sm text-base-content/80">
                      {user?.metadata?.lastSignInTime
                        ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-base-content/60 mb-1">Account Role</p>
                    <div className="badge badge-primary gap-1">
                      {userRole === "admin" ? (
                        <>
                          <FaShieldAlt />
                          Administrator
                        </>
                      ) : (
                        <>
                          <FaUser />
                          User
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                {hasChanges && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-outline gap-2"
                  >
                    <FaUndo />
                    Reset
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all flex-1 md:flex-initial"
                  disabled={loading || !hasChanges}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
