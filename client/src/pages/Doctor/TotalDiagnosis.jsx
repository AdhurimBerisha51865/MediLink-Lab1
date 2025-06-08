import React, { useContext, useEffect, useState } from "react";
import { DiagnosisContext } from "../../context/diagnosisContext";
import { assets } from "../../assets/assets";

const TotalDiagnosis = () => {
  const {
    dToken,
    getDiagnoses,
    diagnosisList,
    deleteDiagnosis,
    updateDiagnosis,
  } = useContext(DiagnosisContext);

  const [editingId, setEditingId] = useState(null);
  const [medicationsEdit, setMedicationsEdit] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [diagnosesPerPage] = useState(5); // Items per page

  useEffect(() => {
    if (dToken) {
      getDiagnoses();
    }
  }, [dToken]);

  // Get current diagnoses for pagination
  const indexOfLastDiagnosis = currentPage * diagnosesPerPage;
  const indexOfFirstDiagnosis = indexOfLastDiagnosis - diagnosesPerPage;
  const currentDiagnoses = diagnosisList.slice(
    indexOfFirstDiagnosis,
    indexOfLastDiagnosis
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const startEdit = (diagnosis) => {
    setEditingId(diagnosis.diagnosis_id);
    setMedicationsEdit(diagnosis.medications.map((med) => ({ ...med })));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicationsEdit];
    updated[index][field] = value;
    setMedicationsEdit(updated);
  };

  const addMedication = () => {
    setMedicationsEdit([
      ...medicationsEdit,
      { medication_name: "", dosage: "", duration: "", notes: "" },
    ]);
  };

  const removeMedication = (index) => {
    setMedicationsEdit(medicationsEdit.filter((_, i) => i !== index));
  };

  const saveEdit = async () => {
    await updateDiagnosis(editingId, { medications: medicationsEdit });
    setEditingId(null);
    setMedicationsEdit([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setMedicationsEdit([]);
  };

  return (
    <div className="w-full max-w-7xl m-5 px-4">
      <p className="mb-4 text-xl font-semibold">All Diagnoses</p>

      <div className="flex flex-col gap-4">
        {currentDiagnoses.map((item) => (
          <div
            key={item.diagnosis_id}
            className="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {item.patient.image && (
                  <img
                    src={item.patient.image}
                    alt={item.patient.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{item.patient.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.diagnosis_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {editingId === item.diagnosis_id ? (
                  <>
                    <button onClick={saveEdit} className="text-green-600">
                      Save
                    </button>
                    <button onClick={cancelEdit} className="text-red-600">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(item)}>
                      <img
                        src={assets.edit_icon}
                        alt="Edit"
                        className="w-6 h-6"
                      />
                    </button>
                    <button onClick={() => deleteDiagnosis(item.diagnosis_id)}>
                      <img
                        src={assets.cancel_icon}
                        alt="Delete"
                        className="w-6 h-6"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-700 space-y-1 mb-2">
              <p>
                <span className="font-semibold">Diagnosis:</span>{" "}
                {item.diagnosis_title}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {item.description || "-"}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {item.doctor.name}
              </p>
            </div>

            <div className="mt-3">
              <p className="font-medium mb-1">Medications:</p>

              {editingId === item.diagnosis_id ? (
                <>
                  {medicationsEdit.map((med, i) => (
                    <div
                      key={i}
                      className="mb-3 space-y-1 border p-2 rounded bg-gray-50"
                    >
                      <input
                        type="text"
                        placeholder="Medication"
                        value={med.medication_name}
                        onChange={(e) =>
                          handleMedChange(i, "medication_name", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedChange(i, "dosage", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) =>
                          handleMedChange(i, "duration", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                      <button
                        onClick={() => removeMedication(i)}
                        className="text-red-600 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addMedication}
                    className="text-blue-600 text-sm"
                  >
                    + Add Medication
                  </button>
                </>
              ) : item.medications.length > 0 ? (
                item.medications.map((med, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">
                        • {med.medication_name}
                      </span>{" "}
                      – {med.dosage} for {med.duration}
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

      {/* Pagination Controls */}
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
              length: Math.ceil(diagnosisList.length / diagnosesPerPage),
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
              Math.ceil(diagnosisList.length / diagnosesPerPage) && (
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

export default TotalDiagnosis;
