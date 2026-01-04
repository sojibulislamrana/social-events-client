import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaHeadset,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Get In Touch
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Have questions, feedback, or ideas? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-primary-content flex items-center justify-center shadow-md">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-sm text-base-content/70">Send us an email</p>
              </div>
            </div>
            <a
              href="mailto:support@socialevents.com"
              className="text-primary hover:underline font-medium"
            >
              support@socialevents.com
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-6 border border-secondary/20 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-secondary text-secondary-content flex items-center justify-center shadow-md">
                <FaPhone className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-sm text-base-content/70">Give us a call</p>
              </div>
            </div>
            <a
              href="tel:+15551234567"
              className="text-secondary hover:underline font-medium"
            >
              +1 (555) 123-4567
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 border border-accent/20 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent text-accent-content flex items-center justify-center shadow-md">
                <FaMapMarkerAlt className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">Visit Us</h3>
                <p className="text-sm text-base-content/70">Our location</p>
              </div>
            </div>
            <p className="text-accent font-medium">
              123 Community Street<br />
              City, State 12345
            </p>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-base-100 rounded-3xl border-2 border-base-300 shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center">
                <FaPaperPlane />
              </div>
              <h2 className="text-2xl font-bold">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaInfoCircle className="text-primary" />
                    Your Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaEnvelope className="text-primary" />
                    Email Address
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full h-12 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <FaPaperPlane className="text-primary" />
                    Message
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-[150px] rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full h-12 rounded-xl shadow-lg hover:shadow-xl transition-all gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Cards */}
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="bg-base-200 rounded-2xl p-5 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <FaHeadset className="text-2xl text-primary" />
                <h3 className="font-semibold">Support & Help</h3>
              </div>
              <p className="text-sm text-base-content/70">
                For technical issues, bug reports, or feature requests, please reach out through this contact form.
              </p>
            </div>
            <div className="bg-base-200 rounded-2xl p-5 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <FaCheckCircle className="text-2xl text-secondary" />
                <h3 className="font-semibold">Quick Response</h3>
              </div>
              <p className="text-sm text-base-content/70">
                We typically respond within 24-48 hours. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
