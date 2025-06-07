import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets2";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const Navbar = ({ userType }) => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);

  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "py-1 border-b-3 border-gray-500" : "py-1"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            isActive ? "py-1 border-b-3 border-gray-500" : "py-1"
          }
        >
          All Doctors
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "py-1 border-b-3 border-gray-500" : "py-1"
          }
        >
          About
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "py-1 border-b-3 border-gray-500" : "py-1"
          }
        >
          Contact
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {/* Dashboard button only if admin or doctor userType is passed */}
        {userType === "admin" && (
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="bg-[#36A3CA] text-white px-6 py-2 rounded-full font-light hidden md:block"
          >
            Dashboard
          </button>
        )}
        {userType === "doctor" && (
          <button
            onClick={() => navigate("/doctor-dashboard")}
            className="bg-[#36A3CA] text-white px-6 py-2 rounded-full font-light hidden md:block"
          >
            Dashboard
          </button>
        )}

        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="User" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointments
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Show create account only if no userType (admin or doctor) and no token
          !userType &&
          !token && (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#36a3ca] text-white px-8 py-3 rounded-full font-light hidden md:block"
            >
              Create account
            </button>
          )
        )}

        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="Menu"
        />
        {/* ----- Mobile Menu ----- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="Logo" />
            <img
              className="w-10"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close Menu"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Home</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">All Doctors</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">About</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Contact</p>
            </NavLink>
            {/* Dashboard button in mobile menu */}
            {userType === "admin" && (
              <li>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/admin-dashboard");
                  }}
                  className="bg-[#36A3CA] text-white px-6 py-2 rounded-full font-light mt-4"
                >
                  Dashboard
                </button>
              </li>
            )}
            {userType === "doctor" && (
              <li>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/doctor-dashboard");
                  }}
                  className="bg-[#36A3CA] text-white px-6 py-2 rounded-full font-light mt-4"
                >
                  Dashboard
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
