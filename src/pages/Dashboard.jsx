import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import {
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaChartLine,
  FaArrowRight,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-base-content/70">
          Welcome back, {user?.displayName || "User"}! Here's your activity summary.
        </p>
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Events Created by Month</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/50">
              No data available. Create events to see statistics.
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-base-100 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">Event Types Distribution</h2>
          {eventTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/50">
              No data available. Create events to see distribution.
            </div>
          )}
        </div>
      </div>

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

