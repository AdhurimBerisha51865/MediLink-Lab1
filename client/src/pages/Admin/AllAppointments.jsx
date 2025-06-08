import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AdminAppContext } from "../../context/AdminAppContext";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } =
    useContext(AdminAppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b border-gray-300 rounded">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {currentAppointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50"
            key={index}
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
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.docData.image}
                alt=""
              />
              <p>{item.docData.name}</p>
            </div>
            <p>
              {currency}
              {item.amount}
            </p>
            <div className="flex items-center gap-2">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <>
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-10 cursor-pointer ml-2"
                    src={assets.tick_icon}
                    alt="Confirm"
                  />
                </>
              )}
            </div>
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

export default AllAppointments;
