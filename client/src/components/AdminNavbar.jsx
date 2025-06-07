import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ userType }) => {
  const { setAToken } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    if (userType === "admin") {
      setAToken("");
      localStorage.removeItem("aToken");
    } else if (userType === "doctor") {
      setDToken("");
      localStorage.removeItem("dToken");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-300 bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="Admin Logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {userType === "admin" ? "Admin" : "Doctor"}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-200 text-gray-800 text-sm px-6 py-2 rounded-full hover:bg-gray-300 transition"
        >
          Home
        </button>

        <button
          onClick={logout}
          className="bg-[#36A3CA] text-white text-sm px-10 py-2 rounded-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
