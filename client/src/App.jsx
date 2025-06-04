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

// Admin pages
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";

const App = () => {
  const { aToken } = useContext(AdminContext);
  const location = useLocation();

  const isAdminPage = aToken && location.pathname.startsWith("/admin");

  return (
    <div className="bg-[#f8f9fd] min-h-screen">
      {/* Navbar */}
      {!isAdminPage ? (
        <div className="mx-4 sm:mx-[10%]">
          <Navbar />
        </div>
      ) : (
        <AdminNavbar />
      )}

      {/* Main layout */}
      <div className="flex">
        {/* Admin Sidebar */}
        {isAdminPage && <AdminSidebar />}

        {/* Content */}
        <div className={`flex-1 ${!isAdminPage ? "mx-4 sm:mx-[10%]" : ""}`}>
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

          {/* Footer */}
          {!isAdminPage && <Footer />}
        </div>
      </div>
    </div>
  );
};

export default App;
