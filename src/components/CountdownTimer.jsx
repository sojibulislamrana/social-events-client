import { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";

const CountdownTimer = ({ eventDate, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!eventDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const event = new Date(eventDate).getTime();
      const difference = event - now;

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (isExpired) {
    return (
      <div className="badge badge-error badge-sm gap-1">
        <FaClock />
        Event started
      </div>
    );
  }

  // Compact single-line version for cards
  if (compact) {
    const parts = [];
    if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
    parts.push(`${String(timeLeft.hours).padStart(2, "0")}h`);
    parts.push(`${String(timeLeft.minutes).padStart(2, "0")}m`);
    
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <FaClock className="text-primary" />
        <span className="font-semibold text-primary">
          {parts.join(" ")}
        </span>
      </div>
    );
  }

  // Full version for event details
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {timeLeft.days > 0 && (
        <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-2xl font-bold text-primary">{timeLeft.days}</span>
          <span className="text-xs text-base-content/70">Days</span>
        </div>
      )}
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
        <span className="text-2xl font-bold text-primary">{String(timeLeft.hours).padStart(2, "0")}</span>
        <span className="text-xs text-base-content/70">Hours</span>
      </div>
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
        <span className="text-2xl font-bold text-primary">{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span className="text-xs text-base-content/70">Mins</span>
      </div>
      <div className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2 min-w-[60px]">
        <span className="text-2xl font-bold text-primary">{String(timeLeft.seconds).padStart(2, "0")}</span>
        <span className="text-xs text-base-content/70">Secs</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
