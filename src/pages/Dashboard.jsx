import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import {
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaChartLine,
  FaArrowRight,
  FaCrown,
  FaUserShield,
} from "react-icons/fa";

const Dashboard = () => {
  const { user, userRole } = useContext(AuthContext);
  const [stats, setStats] = useState({
    myEvents: 0,
    joinedEvents: 0,
    upcomingEvents: 0,
    totalEvents: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [eventTypeData, setEventTypeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);
  const [monthlyJoinedData, setMonthlyJoinedData] = useState([]);
  const [runningEvents, setRunningEvents] = useState([]);
  const [allEventsStats, setAllEventsStats] = useState({ total: 0, upcoming: 0, past: 0 });

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const [myEventsRes, joinedRes, allEventsRes] = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/events/user?email=${encodeURIComponent(
              user.email
            )}`
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/joined?email=${encodeURIComponent(
              user.email
            )}`
          ),
          fetch(`${import.meta.env.VITE_API_URL}/events/upcoming`),
        ]);

        const myEventsData = await myEventsRes.json();
        const joinedData = await joinedRes.json();
        const allEventsData = await allEventsRes.json();

        const myEvents = myEventsData.events || [];
        const joinedEvents = joinedData.joinedEvents || [];
        const upcomingEvents = allEventsData.events || [];
        const now = new Date();

        // Calculate running events (events happening today)
        const running = myEvents.filter(event => {
          const eventDate = new Date(event.eventDate);
          const eventEnd = new Date(eventDate);
          eventEnd.setHours(eventEnd.getHours() + 4); // Assume 4 hour events
          return eventDate <= now && eventEnd >= now;
        });

        // Calculate past events
        const pastEvents = myEvents.filter(event => new Date(event.eventDate) < now);

        setRunningEvents(running);
        setAllEventsStats({
          total: myEvents.length,
          upcoming: myEvents.filter(e => new Date(e.eventDate) > now).length,
          past: pastEvents.length,
        });

        setStats({
          myEvents: myEvents.length,
          joinedEvents: joinedEvents.length,
          upcomingEvents: upcomingEvents.length,
          totalEvents: upcomingEvents.length,
        });

        // Prepare chart data - events by month
        const eventsByMonth = {};
        myEvents.forEach((event) => {
          const date = new Date(event.eventDate);
          const month = date.toLocaleString("default", { month: "short" });
          eventsByMonth[month] = (eventsByMonth[month] || 0) + 1;
        });

        const chartDataArray = Object.entries(eventsByMonth).map(
          ([month, count]) => ({
            month,
            events: count,
          })
        );
        setChartData(chartDataArray);

        // Event type distribution
        const typeCount = {};
        myEvents.forEach((event) => {
          typeCount[event.eventType] = (typeCount[event.eventType] || 0) + 1;
        });

        const eventTypeArray = Object.entries(typeCount).map(([type, count]) => ({
          name: type,
          value: count,
        }));
        setEventTypeData(eventTypeArray);

        // Recent events (last 5)
        setRecentEvents(myEvents.slice(0, 5));

        // Monthly joined events statistics
        const monthlyJoined = {};
        joinedEvents.forEach((joined) => {
          const date = new Date(joined.joinedAt || joined.eventDate);
          const month = date.toLocaleString("default", { month: "short" });
          monthlyJoined[month] = (monthlyJoined[month] || 0) + 1;
        });

        const monthlyArray = Object.entries(monthlyJoined)
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return months.indexOf(a.month) - months.indexOf(b.month);
          });
        setMonthlyJoinedData(monthlyArray);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.email]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const maxEvents = chartData.length > 0 
    ? Math.max(...chartData.map(d => d.events), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-base-content/70">
              Welcome back, <span className="font-semibold text-primary">{user?.displayName || "User"}</span>! Here's your activity summary.
            </p>
          </div>
          {/* Role Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-md">
            {userRole === "admin" ? (
              <>
                <FaCrown className="text-accent" />
                <span className="font-semibold text-base-content">Administrator</span>
              </>
            ) : (
              <>
                <FaUserShield className="text-primary" />
                <span className="font-semibold text-base-content">User</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaCalendarAlt className="text-3xl text-primary" />
            <Link
              to="/dashboard/my-events"
              className="text-xs text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.myEvents}</div>
          <p className="text-sm text-base-content/70">My Created Events</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaHeart className="text-3xl text-secondary" />
            <Link
              to="/dashboard/joined-events"
              className="text-xs text-secondary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.joinedEvents}</div>
          <p className="text-sm text-base-content/70">Joined Events</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaUsers className="text-3xl text-accent" />
            <Link
              to="/upcoming-events"
              className="text-xs text-accent hover:underline"
            >
              Explore
            </Link>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.upcomingEvents}</div>
          <p className="text-sm text-base-content/70">Upcoming Events</p>
        </div>

        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <FaChartLine className="text-3xl text-primary" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {stats.myEvents + stats.joinedEvents}
          </div>
          <p className="text-sm text-base-content/70">Total Activity</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="text-2xl font-bold mb-1 text-primary">{allEventsStats.total}</div>
          <p className="text-sm text-base-content/70">Total Events Created</p>
        </div>
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="text-2xl font-bold mb-1 text-secondary">{allEventsStats.upcoming}</div>
          <p className="text-sm text-base-content/70">Upcoming Events</p>
        </div>
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <div className="text-2xl font-bold mb-1 text-accent">{runningEvents.length}</div>
          <p className="text-sm text-base-content/70">Running Events</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - CSS Based */}
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Events Created by Month</h2>
          {chartData.length > 0 ? (
            <div className="h-[300px] space-y-4">
              {chartData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.month}</span>
                    <span className="text-sm font-semibold text-primary">
                      {item.events} {item.events === 1 ? "event" : "events"}
                    </span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/70 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{
                        width: `${(item.events / maxEvents) * 100}%`,
                      }}
                    >
                      {item.events > 0 && (
                        <span className="text-xs font-semibold text-primary-content">
                          {item.events}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/50">
              No data available. Create events to see statistics.
            </div>
          )}
        </div>

        {/* Pie Chart - CSS Based */}
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Event Types Distribution</h2>
          {eventTypeData.length > 0 ? (
            <div className="h-[300px] space-y-4">
              {eventTypeData.map((item, idx) => {
                const total = eventTypeData.reduce((sum, d) => sum + d.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        {item.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[idx % COLORS.length],
                        }}
                      >
                        {percentage > 10 && (
                          <span className="text-xs font-semibold text-white">
                            {percentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/50">
              No data available. Create events to see distribution.
            </div>
          )}
        </div>
      </div>

      {/* Monthly Joined Events Chart */}
      {monthlyJoinedData.length > 0 && (
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Monthly Event Participations</h2>
          <div className="h-[300px] space-y-4">
            {monthlyJoinedData.map((item, idx) => {
              const maxCount = Math.max(...monthlyJoinedData.map(d => d.count), 1);
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.month}</span>
                    <span className="text-sm font-semibold text-secondary">
                      {item.count} {item.count === 1 ? "event" : "events"}
                    </span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-secondary to-secondary/70 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                      }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-semibold text-white">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Events Table */}
      <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Events</h2>
          <Link
            to="/dashboard/my-events"
            className="btn btn-sm btn-outline flex items-center gap-2"
          >
            View All <FaArrowRight />
          </Link>
        </div>
        {recentEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr key={event._id}>
                    <td className="font-medium">{event.title}</td>
                    <td>
                      <span className="badge badge-outline">
                        {event.eventType}
                      </span>
                    </td>
                    <td>{event.location}</td>
                    <td>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/event/${event._id}`}
                        className="btn btn-xs btn-outline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-base-content/70">
            <p className="mb-4">No events created yet.</p>
            <Link to="/create-event" className="btn btn-primary">
              Create Your First Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
