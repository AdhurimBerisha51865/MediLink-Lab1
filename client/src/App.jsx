import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import Footer from "./components/Footer";

import { AppContext } from "./context/AppContext";
import { AdminContext } from "./context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { token: userToken } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const isAdminLoggedIn = Boolean(aToken);
  const isDoctorLoggedIn = Boolean(dToken);
  const isUserLoggedIn = Boolean(userToken);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isDoctorRoute =
    location.pathname === "/doctor-dashboard" ||
    location.pathname.startsWith("/doctor/");

  const showDashboardButton =
    !isAdminRoute && !isDoctorRoute && (isAdminLoggedIn || isDoctorLoggedIn);

  const showMainNavbar =
    !isAdminLoggedIn &&
    !isDoctorLoggedIn &&
    location.pathname !== "/admin-login";

  return (
    <div className="min-h-screen bg-[#f8f9fd] flex flex-col">
      {showDashboardButton ? (
        <div className="mx-4 sm:mx-[10%]">
          <Navbar
            userType={isAdminLoggedIn ? "admin" : "doctor"}
            showDashboardButton={true}
          />
        </div>
      ) : (
        showMainNavbar && (
          <div className="mx-4 sm:mx-[10%]">
            <Navbar />
          </div>
        )
      )}

      {isAdminLoggedIn && !showDashboardButton && isAdminRoute && (
        <AdminNavbar userType="admin" />
      )}
      {isDoctorLoggedIn && !showDashboardButton && isDoctorRoute && (
        <AdminNavbar userType="doctor" />
      )}

      <div className="flex flex-1">
        {(isAdminRoute && isAdminLoggedIn) ||
        (isDoctorRoute && isDoctorLoggedIn) ? (
          <AdminSidebar />
        ) : null}

        <main
          className={`flex-1 ${
            !isAdminRoute && !isDoctorRoute ? "mx-4 sm:mx-[10%]" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:specialty" element={<Doctors />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/appointment/:docId" element={<Appointment />} />

            <Route
              path="/admin-login"
              element={
                isAdminLoggedIn ? (
                  <Navigate to="/admin-dashboard" />
                ) : (
                  <AdminLogin />
                )
              }
            />
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

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {!isAdminRoute &&
            !isDoctorRoute &&
            location.pathname !== "/admin-login" && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default App;
