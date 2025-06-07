import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";
import { AppContext } from "./context/AppContext";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import AdminLogin from "./pages/AdminLogin";
import StripeCardPayment from "./pages/StripeCardPayment";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { token: normalUserToken } = useContext(AppContext);
  const location = useLocation();

  const isAdminLoggedIn = Boolean(aToken);
  const isDoctorLoggedIn = Boolean(dToken);
  const isNormalUserLoggedIn = Boolean(normalUserToken);

  const isNoUserLoggedIn =
    !isAdminLoggedIn && !isDoctorLoggedIn && !isNormalUserLoggedIn;

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDoctorRoute = location.pathname.startsWith("/doctor");

  const showNavbar =
    !isAdminLoggedIn &&
    !isDoctorLoggedIn &&
    location.pathname !== "/admin-login";

  return (
    <div className="bg-[#f8f9fd] min-h-screen">
      {showNavbar && (
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
        </div>
      )}
      {isAdminLoggedIn && <AdminNavbar userType="admin" />}
      {isDoctorLoggedIn && !isAdminLoggedIn && (
        <AdminNavbar userType="doctor" />
      )}

      <div className="flex">
        {(isAdminRoute && isAdminLoggedIn) ||
        (isDoctorRoute && isDoctorLoggedIn) ? (
          <AdminSidebar />
        ) : null}

        <div
          className={`flex-1 ${
            !isAdminRoute && !isDoctorRoute ? "mx-4 sm:mx-[10%]" : ""
          }`}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:specialty" element={<Doctors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointment/:docId" element={<Appointment />} />

            <Route
              path="/payment/:appointmentId"
              element={
                <Elements stripe={stripePromise}>
                  <StripeCardPayment />
                </Elements>
              }
            />

            {/* Admin & Doctor Login route */}
            <Route
              path="/admin-login"
              element={
                isAdminLoggedIn ? (
                  <Navigate to="/admin-dashboard" />
                ) : isDoctorLoggedIn ? (
                  <Navigate to="/doctor-dashboard" />
                ) : isNormalUserLoggedIn ? (
                  <Navigate to="/" />
                ) : (
                  <AdminLogin />
                )
              }
            />

            {/* Admin Dashboard routes */}
            <Route
              path="/admin-dashboard"
              element={
                isAdminLoggedIn ? <Dashboard /> : <Navigate to="/admin-login" />
              }
            />
            <Route
              path="/admin/all-appointments"
              element={
                isAdminLoggedIn ? (
                  <AllAppointments />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
            <Route
              path="/admin/add-doctor"
              element={
                isAdminLoggedIn ? <AddDoctor /> : <Navigate to="/admin-login" />
              }
            />
            <Route
              path="/admin/doctor-list"
              element={
                isAdminLoggedIn ? (
                  <DoctorsList />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />

            {/* Doctor Dashboard routes */}
            <Route
              path="/doctor-dashboard"
              element={
                isDoctorLoggedIn ? (
                  <DoctorDashboard />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
            <Route
              path="/doctor/doctor-appointments"
              element={
                isDoctorLoggedIn ? (
                  <DoctorAppointments />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
            <Route
              path="/doctor/doctor-profile"
              element={
                isDoctorLoggedIn ? (
                  <DoctorProfile />
                ) : (
                  <Navigate to="/admin-login" />
                )
              }
            />
          </Routes>

          <ToastContainer />

          {/* Footer */}
          {!isAdminRoute &&
            !isDoctorRoute &&
            location.pathname !== "/admin-login" && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default App;
