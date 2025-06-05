import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const location = useLocation();

  // Show sidebar only if admin is logged in and on admin routes
  const isAdminPage = aToken && location.pathname.startsWith("/admin");
  const isDoctorPage = dToken && location.pathname.startsWith("/doctor");

  return (
    <div className="bg-[#f8f9fd] min-h-screen">
      {/* Navbar / AdminNavbar */}
      {!aToken && !dToken ? (
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
        </div>
      ) : null}
      {aToken && <AdminNavbar userType="admin" />}
      {dToken && !aToken && <AdminNavbar userType="doctor" />}

      <div className="flex">
        {/* Sidebar only for admin */}
        {isAdminPage && <AdminSidebar />}
        {/* Add doctor sidebar here if needed */}

        <div
          className={`flex-1 ${
            !isAdminPage && !isDoctorPage ? "mx-4 sm:mx-[10%]" : ""
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
                aToken ? (
                  <Navigate to="/admin-dashboard" />
                ) : dToken ? (
                  <Navigate to="/doctor-dashboard" />
                ) : (
                  <AdminLogin />
                )
              }
            />

            {/* Admin Dashboard - only for admins */}
            <Route
              path="/admin-dashboard"
              element={aToken ? <Dashboard /> : <Navigate to="/admin-login" />}
            />

            {/* Doctor Dashboard - only for doctors */}
            <Route
              path="/doctor-dashboard"
              element={dToken ? <DoctorDashboard /> : <Navigate to="/login" />}
            />

            {/* Admin-specific routes */}
            <Route
              path="/admin/all-appointments"
              element={
                aToken ? <AllAppointments /> : <Navigate to="/admin-login" />
              }
            />
            <Route
              path="/admin/add-doctor"
              element={aToken ? <AddDoctor /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/admin/doctor-list"
              element={
                aToken ? <DoctorsList /> : <Navigate to="/admin-login" />
              }
            />
          </Routes>

          <ToastContainer />

          {/* Show footer only if NOT on admin or doctor pages */}
          {!isAdminPage && !isDoctorPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default App;
