import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { AdminAppContext } from "../../context/AdminAppContext";
import { DiagnosisContext } from "../../context/DiagnosisContext";

const DoctorDashboard = () => {
  const {
    dToken,
    dashData,
    setDashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { getDiagnoses, diagnosisList } = useContext(DiagnosisContext);
  const { currency, slotDateFormat } = useContext(AdminAppContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(5);

  useEffect(() => {
    if (dToken) {
      getDashData();
      getDiagnoses();
    }
  }, [dToken]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = dashData?.latestAppointments?.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency}
                {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Patients</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-300 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.diagnosis_card_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {diagnosisList?.length || 0}
              </p>
              <p className="text-gray-400">Diagnoses</p>
            </div>
          </div>
        </div>

        <div className="bg-white mt-10">
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border border-gray-300">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          <div className="pt-4 border border-t-0 border-gray-300">
            {currentAppointments?.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {dashData?.latestAppointments?.length > appointmentsPerPage && (
            <div className="flex justify-center py-4 border border-t-0 border-gray-300">
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
                    length: Math.ceil(
                      dashData.latestAppointments.length / appointmentsPerPage
                    ),
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
                    Math.ceil(
                      dashData.latestAppointments.length / appointmentsPerPage
                    ) && (
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
      </div>
    )
  );
};

export default DoctorDashboard;
