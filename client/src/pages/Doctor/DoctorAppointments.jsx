import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AdminAppContext } from "../../context/AdminAppContext";
import { assets } from "../../assets/assets";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } =
    useContext(AdminAppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = [...appointments]
    .reverse()
    .slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-5xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {currentAppointments.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50"
          >
            <p className="max-sm:hidden">
              {indexOfFirstAppointment + index + 1}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <div className="text-xs inline-border border-gray-300 px-2 rounded-full">
              <p>{item.payment ? "Online" : "Cash"}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {currency}
              {item.amount}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-medium font-medium">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-medium font-medium">
                Completed
              </p>
            ) : (
              <div className="flex">
                <img
                  className="w-10 cursor-pointer"
                  onClick={() => cancelAppointment(item._id)}
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  className="w-10 cursor-pointer"
                  onClick={() => completeAppointment(item._id)}
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {appointments.length > appointmentsPerPage && (
        <div className="flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <ul className="flex items-center space-x-2">
              {currentPage > 1 && (
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                </li>
              )}

              {Array.from({
                length: Math.ceil(appointments.length / appointmentsPerPage),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === index + 1
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}

              {currentPage <
                Math.ceil(appointments.length / appointmentsPerPage) && (
                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
