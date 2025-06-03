import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AdminContext } from "./context/AdminContext";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import AdminLogin from "./pages/AdminLogin";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Admin pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const location = useLocation();

  const isAdminPage = aToken && location.pathname.startsWith("/admin");

  return (
    <div>
      {/* Top navbar */}
      {isAdminPage ? <AdminNavbar /> : <Navbar />}

      {/* Page layout: sidebar + content */}
      <div className="flex bg-[#f8f9fd]">
        {/* Sidebar for admin pages */}
        {isAdminPage && <AdminSidebar />}

        <div className="flex-1 ">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:specialty" element={<Doctors />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointment/:docId" element={<Appointment />} />

            {/* Admin Routes */}
            <Route
              path="/admin-login"
              element={
                aToken ? <Navigate to="/admin-dashboard" /> : <AdminLogin />
              }
            />
            <Route
              path="/admin-dashboard"
              element={aToken ? <Dashboard /> : <Navigate to="/admin-login" />}
            />
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

          {/* Show footer only on non-admin pages */}
          {!isAdminPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default App;