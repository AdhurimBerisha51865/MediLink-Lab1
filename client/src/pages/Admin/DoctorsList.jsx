import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } =
    useContext(AdminContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(10);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="m-5">
      <h1 className="text-lg font-medium">All Doctors</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {currentDoctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              className="bg-indigo-50 group-hover:bg-[#36A3CA] transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.specialty}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item.id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
                <button
                  className="mt-2 ml-12 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this doctor?"
                      )
                    ) {
                      deleteDoctor(item.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {doctors.length > doctorsPerPage && (
        <div className="flex justify-center mt-6">
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
                length: Math.ceil(doctors.length / doctorsPerPage),
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

              {currentPage < Math.ceil(doctors.length / doctorsPerPage) && (
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

export default DoctorsList;
