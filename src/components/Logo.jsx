import { Link } from "react-router-dom";

const Logo = ({ className = "", variant = "light" }) => {
  const isLight = variant === "light";
  // Always use white text for light variant (on colored background), base-content for dark variant
  const textColor = isLight ? "text-white" : "text-base-content";
  const subtitleColor = isLight ? "text-white/90" : "text-base-content/70";
  const bgColor = isLight 
    ? "bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md border-white/40" 
    : "bg-gradient-to-br from-primary to-secondary";
  const borderColor = isLight ? "border-white/40" : "border-primary/30";
  const iconColor = isLight ? "text-white" : "text-base-100";

  return (
    <Link
      to="/"
      className={`flex items-center gap-3 hover:opacity-90 transition-all group ${className}`}
    >
      {/* Company Logo - Professional Design */}
      <div className={`relative w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shadow-xl border-2 ${borderColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {/* Logo SVG - Community/People Icon */}
        <svg 
          className={`w-7 h-7 ${iconColor} drop-shadow-lg`}
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        {isLight && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white shadow-lg animate-pulse" />
        )}
      </div>
      <div className="hidden sm:block">
        <span className={`text-xl font-bold ${textColor} drop-shadow-lg group-hover:drop-shadow-xl transition-all`}>
          SocialEvents
        </span>
        <p className={`text-[10px] ${subtitleColor} leading-tight font-medium`}>
          Community Platform
        </p>
      </div>
    </Link>
  );
};

export default Logo;

