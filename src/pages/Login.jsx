import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast from "react-hot-toast";

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Demo credentials
  const demoCredentials = {
    user: {
      email: "user@demo.com",
      password: "Demo123",
    },
    admin: {
      email: "admin@demo.com",
      password: "Admin123",
    },
  };

  const handleDemoLogin = async (type) => {
    const creds = demoCredentials[type];
    if (!creds) return;

    // Auto-fill form
    setEmail(creds.email);
    setPassword(creds.password);

    setError("");
    setLoading(true);
    try {
      await signInUser(creds.email, creds.password);
      toast.success(`Logged in as ${type}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error("Demo login failed. Please register these accounts first.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      toast.success("Logged in successfully!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error("Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl rounded-2xl">
        <div className="card-body space-y-6">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full h-12 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text text-sm font-medium">Password</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter password"
                className="input input-bordered w-full h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              className="btn btn-primary w-full h-12 rounded-xl mt-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="space-y-2">
            <p className="text-xs text-center text-base-content/60">
              Demo Credentials (Click to auto-fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin("user")}
                className="btn btn-outline btn-sm"
                disabled={loading}
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoLogin("admin")}
                className="btn btn-outline btn-sm"
                disabled={loading}
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full h-12 rounded-xl"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Continue with Google"}
          </button>

          <p className="text-sm text-center pt-2">
            New here?{" "}
            <Link to="/register" className="link link-primary font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
