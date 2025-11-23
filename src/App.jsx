import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import ThemeProvider from "./providers/ThemeProvider";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UpcomingEvents from "./pages/UpcomingEvents";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import ManageEvents from "./pages/ManageEvents";
import JoinedEvents from "./pages/JoinedEvents";
import NotFound from "./pages/NotFound";

import PrivateRoute from "./routes/PrivateRoute";
import { Toaster } from "react-hot-toast";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

const App = () => {
  return (
    <ThemeProvider>
      {" "}
      <AuthProvider>
        {" "}
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="upcoming-events" element={<UpcomingEvents />} />
              <Route path="event/:id" element={<EventDetails />} />

              <Route path="about" element={<About />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="contact" element={<Contact />} />

              <Route
                path="create-event"
                element={
                  <PrivateRoute>
                    <CreateEvent />
                  </PrivateRoute>
                }
              />
              <Route
                path="manage-events"
                element={
                  <PrivateRoute>
                    <ManageEvents />
                  </PrivateRoute>
                }
              />
              <Route
                path="joined-events"
                element={
                  <PrivateRoute>
                    <JoinedEvents />
                  </PrivateRoute>
                }
              />

              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
