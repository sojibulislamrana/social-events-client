import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaEnvelope, FaPhone } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t bg-base-200/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* LEFT — Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-black text-primary">SE</span>
            </div>
            <div>
              <p className="text-base font-semibold">SocialEvents</p>
              <p className="text-xs text-base-content/60">
                Empowering community development.
              </p>
            </div>
          </div>

          {/* CENTER — Useful Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/upcoming-events" className="hover:text-primary transition-colors">
              Explore Events
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>

        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-8 border-t border-base-300 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm text-base-content/70">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-primary" />
                <span>support@socialevents.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Follow Us</h3>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/_sir4n4?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
                aria-label="Twitter"
              >
                <FaXTwitter className="text-lg" />
              </a>
              <a
                href="https://www.facebook.com/sir4n4/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="https://github.com/radiumSodium"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/radiumsodium/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="mt-8 text-center text-xs text-base-content/60">
          © {year} Social Development Events. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
