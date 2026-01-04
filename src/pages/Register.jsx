import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import Spinner from "../components/Spinner";

const Register = () => {
  const { createUser, signInWithGoogle, syncUserWithMongoDB } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password))
      return "Must contain at least one uppercase letter";
    if (!/[a-z]/.test(password))
      return "Must contain at least one lowercase letter";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const photoURL = form.photoURL.value;
    const password = form.password.value;

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      toast.error(passwordError);
      return;
    }

    try {
      setLoading(true);
      const result = await createUser(email, password);

      // Update Firebase profile
      await updateProfile(result.user, { displayName: name, photoURL });

      // Sync with MongoDB
      await syncUserWithMongoDB(result.user);

      toast.success("Account created successfully! 🎉");
      // Redirect to home since user is automatically logged in
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      // Sync with MongoDB
      await syncUserWithMongoDB(result.user);
      toast.success("Account created with Google! 🎉");
      // Redirect to home since user is automatically logged in
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Google signup failed!");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body space-y-6">
          {/* Heading */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-sm text-base-content/70 mt-1">
              Join us and start participating today.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="input input-bordered w-full h-12 rounded-xl"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="input input-bordered w-full h-12 rounded-xl"
                required
              />
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">
                  Photo URL
                </span>
              </label>
              <input
                type="url"
                name="photoURL"
                placeholder="https://your-photo-link.com"
                className="input input-bordered w-full h-12 rounded-xl"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="input input-bordered w-full h-12 rounded-xl"
                required
              />
              <p className="mt-1 text-[11px] text-base-content/60">
                Must be at least 6 characters, include one uppercase and one
                lowercase letter.
              </p>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-12 rounded-xl text-base font-semibold mt-2"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Google Signup */}
          <button
            onClick={handleGoogleSignup}
            className="btn btn-outline w-full h-12 rounded-xl"
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <>
                <Spinner size="sm" />
                Signing up...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Bottom link */}
          <p className="text-sm text-center pt-2">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
