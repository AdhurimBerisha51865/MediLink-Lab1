import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const AdminSidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen bg-white border-r border-gray-300">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.home_icon} alt="Dashboard" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to="/admin/all-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.appointment_icon} alt="Appointments" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            to="/admin/add-doctor"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.add_icon} alt="Add Doctor" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink
            to="/admin/doctor-list"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.people_icon} alt="Doctors List" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>

          <NavLink
            to="/admin/total-diagnosis"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img
              className="w-8.5 h-8 ml-[-5.5px]"
              src={assets.total_diagnosis_icon}
              alt="Diagnosis"
            />
            <p className="hidden md:block">Total Diagnosis</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            to="/doctor-dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.home_icon} alt="Dashboard" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink
            to="/doctor/doctor-appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.appointment_icon} alt="Appointments" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink
            to="/doctor/doctor-profile"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img src={assets.people_icon} alt="Profile" />
            <p className="hidden md:block">Profile</p>
          </NavLink>

          <NavLink
            to="/doctor/add-diagnosis"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img
              className="w-8.5 h-8 ml-[-5.5px]"
              src={assets.diagnosis_icon}
              alt="Diagnosis"
            />
            <p className="hidden md:block">Add Diagnosis</p>
          </NavLink>
          <NavLink
            to="/doctor/total-diagnosis"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#f2f3ff] border-r-4 border-gray-300" : ""
              }`
            }
          >
            <img
              className="w-8.5 h-8 ml-[-5.5px]"
              src={assets.total_diagnosis_icon}
              alt="Diagnosis"
            />
            <p className="hidden md:block">Total Diagnosis</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default AdminSidebar;
