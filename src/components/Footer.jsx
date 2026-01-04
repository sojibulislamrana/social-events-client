import { Link } from "react-router-dom";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t-2 border-base-300 bg-gradient-to-b from-base-200/90 to-base-200/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-xl font-black text-white">SE</span>
              </div>
              <div>
                <p className="text-lg font-bold">SocialEvents</p>
                <p className="text-xs text-base-content/60">
                  Community Platform
                </p>
              </div>
            </div>
            <p className="text-sm text-base-content/70">
              Empowering communities through social development events. Join us in making a difference!
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://x.com/_sir4n4?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                aria-label="Twitter"
              >
                <FaXTwitter className="text-lg" />
              </a>
              <a
                href="https://www.facebook.com/sir4n4/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href="https://github.com/radiumSodium"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                aria-label="GitHub"
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/radiumsodium/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-circle btn-sm hover:bg-primary hover:text-primary-content transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upcoming-events" className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-base-content/70 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">Legal & Info</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-base-content/70 hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-base-content/70 hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-sm text-base-content/70 hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-base-content/70 hover:text-secondary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-accent mt-1 flex-shrink-0" />
                <a href="mailto:support@socialevents.com" className="text-sm text-base-content/70 hover:text-accent transition-colors">
                  support@socialevents.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaPhone className="text-accent mt-1 flex-shrink-0" />
                <a href="tel:+15551234567" className="text-sm text-base-content/70 hover:text-accent transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-accent mt-1 flex-shrink-0" />
                <span className="text-sm text-base-content/70">
                  123 Community Street<br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t-2 border-base-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-base-content/60 text-center md:text-left">
              © {year} Social Development Events. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <span>Made with</span>
              <FaHeart className="text-error animate-pulse" />
              <span>for the community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
