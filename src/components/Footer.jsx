import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
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
            <a href="/about" className="hover:text-primary cursor-pointer">
              About
            </a>
            <a href="/privacy" className="hover:text-primary cursor-pointer">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-primary cursor-pointer">
              Terms & Conditions
            </a>
            <a href="/contact" className="hover:text-primary cursor-pointer">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="https://x.com/_sir4n4?s=21"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
            >
              <FaXTwitter className="text-lg" />
            </a>

            <a
              href="https://www.facebook.com/sir4n4/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
            >
              <FaFacebookF className="text-lg" />
            </a>

            <a
              href="https://github.com/radiumSodium"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
            >
              <FaGithub className="text-lg" />
            </a>

            <a
              href="https://www.linkedin.com/in/radiumsodium/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-circle btn-sm hover:bg-base-300"
            >
              <FaLinkedinIn className="text-lg" />
            </a>
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
