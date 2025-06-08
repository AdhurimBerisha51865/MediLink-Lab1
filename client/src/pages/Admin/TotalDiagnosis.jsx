import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const TotalDiagnosisAdmin = () => {
  const { aToken, diagnoses, fetchAllDiagnoses } = useContext(AdminContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnosesPerPage] = useState(5);

  useEffect(() => {
    if (aToken) {
      fetchAllDiagnoses();
    }
  }, [aToken]);

  const indexOfLastDiagnosis = currentPage * diagnosesPerPage;
  const indexOfFirstDiagnosis = indexOfLastDiagnosis - diagnosesPerPage;
  const currentDiagnoses = diagnoses.slice(
    indexOfFirstDiagnosis,
    indexOfLastDiagnosis
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-7xl m-5 px-4">
      <p className="mb-4 text-xl font-semibold">All Diagnoses</p>

      <div className="flex flex-col gap-4">
        {currentDiagnoses.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {diagnosis.patient.image && (
                  <img
                    src={diagnosis.patient.image}
                    alt={diagnosis.patient.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{diagnosis.patient.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(diagnosis.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1 mb-2">
              <p>
                <span className="font-semibold">Diagnosis:</span>{" "}
                {diagnosis.title}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {diagnosis.description || "-"}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {diagnosis.doctor.name} ({diagnosis.doctor.specialty})
              </p>
            </div>

            <div className="mt-3">
              <p className="font-medium mb-1">Medications:</p>
              {diagnosis.medications.length > 0 ? (
                diagnosis.medications.map((med, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">• {med.name}</span> -{" "}
                      {med.dosage} for {med.duration}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No medications listed.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

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
              length: Math.ceil(diagnoses.length / diagnosesPerPage),
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

            {currentPage < Math.ceil(diagnoses.length / diagnosesPerPage) && (
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
    </div>
  );
};

export default TotalDiagnosisAdmin;
