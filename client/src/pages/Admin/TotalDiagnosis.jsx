import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";

const TotalDiagnosisAdmin = () => {
  const { aToken, diagnoses, fetchAllDiagnoses } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      fetchAllDiagnoses();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-7xl m-5 px-4">
      <p className="mb-4 text-xl font-semibold">All Diagnoses</p>

      <div className="flex flex-col gap-4">
        {diagnoses.map((diagnosis) => (
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

            {diagnosis.futureCheckups &&
              diagnosis.futureCheckups.length > 0 && (
                <div className="mt-3">
                  <p className="font-medium mb-1">Future Checkups:</p>
                  {diagnosis.futureCheckups.map((checkup, i) => (
                    <div key={i} className="text-sm text-gray-600">
                      <p>
                        • {new Date(checkup.date).toLocaleDateString()} -{" "}
                        {checkup.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalDiagnosisAdmin;
