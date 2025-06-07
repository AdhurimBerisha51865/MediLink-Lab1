import { useContext, useEffect } from "react";
import { DiagnosisContext } from "../../context/diagnosisContext";

const TotalDiagnosis = () => {
  const { dToken, getDiagnoses, diagnosisList } = useContext(DiagnosisContext);

  useEffect(() => {
    if (dToken) {
      getDiagnoses();
    }
  }, [dToken]);

  return (
    <div className="w-full max-w-5xl m-5">
      <p className="mb-3 text-lg font-medium">All Diagnoses</p>

      <div className="bg-white border border-gray-300 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_3fr_2fr_2fr] py-3 px-6 border-b border-gray-300">
          <p>#</p>
          <p>Patient</p>
          <p>Diagnosis Title</p>
          <p>Date</p>
          <p>Date of Birth</p>
        </div>

        {diagnosisList.map((item, index) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_3fr_2fr_2fr] items-center text-gray-500 py-3 px-6 border-b border-gray-300 hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <p>{item.patient_name}</p>
            </div>
            <p>{item.diagnosis_title}</p>
            <p>{new Date(item.diagnosis_date).toLocaleDateString()}</p>
            <p className="max-sm:hidden">
              {item.patient_dob
                ? new Date(item.patient_dob).toLocaleDateString()
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalDiagnosis;
