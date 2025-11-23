import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const [error, setError] = useState("");
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
      const result = await createUser(email, password);

      await updateProfile(result.user, { displayName: name, photoURL });

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-base-100 rounded-3xl shadow-xl p-8 md:p-10 border border-base-300/50">
        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-sm text-base-content/70 mt-1">
            Join us and start participating today.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className="input input-bordered rounded-xl h-12"
              required
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              className="input input-bordered rounded-xl h-12"
              required
            />
          </div>

          {/* Photo URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Photo URL</span>
            </label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://your-photo-link.com"
              className="input input-bordered rounded-xl h-12"
              required
            />
          </div>

          {/* Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="input input-bordered rounded-xl h-12"
              required
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit button */}
          <button className="btn btn-primary w-full h-12 rounded-xl text-base font-semibold mt-2">
            Create Account
          </button>
        </form>

        {/* Bottom link */}
        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="link link-primary font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
