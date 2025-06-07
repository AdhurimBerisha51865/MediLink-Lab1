import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DiagnosisContext } from "../../context/diagnosisContext";

const AddDiagnosis = () => {
  const { createDiagnosis, loading, backendUrl, dToken } =
    useContext(DiagnosisContext);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    diagnosisTitle: "",
    description: "",
    medications: [{ name: "", dosage: "", duration: "" }],
    futureCheckupDate: "",
    futureCheckupPurpose: "",
    futureCheckupNotes: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/all`, {
          headers: { token: dToken },
        });

        if (response.data.success) {
          setUsers(response.data.users || []);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Failed to load users", error);
        toast.error("Failed to load patients list");
      }
    };

    if (dToken) {
      fetchUsers();
    }
  }, [backendUrl, dToken]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    const user = users.find((u) => u._id === userId);
    setSelectedUser(user);
  };

  const handleMedicationChange = (index, e) => {
    const newMedications = [...form.medications];
    newMedications[index][e.target.name] = e.target.value;
    setForm({ ...form, medications: newMedications });
  };

  const addMedication = () => {
    setForm({
      ...form,
      medications: [
        ...form.medications,
        { name: "", dosage: "", duration: "" },
      ],
    });
  };

  const removeMedication = (index) => {
    const newMedications = form.medications.filter((_, i) => i !== index);
    setForm({ ...form, medications: newMedications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser || !form.diagnosisTitle || !form.description) {
      toast.error("Please select a patient and enter diagnosis details");
      return;
    }

    const validMedications = form.medications.filter(
      (med) => med.name && med.dosage && med.duration
    );

    if (validMedications.length === 0) {
      toast.error("Please add at least one complete medication");
      return;
    }

    const formattedDob = (() => {
      if (!selectedUser?.dob) return null;
      const dobDate = new Date(selectedUser.dob);
      console.log(selectedUser.dob);
      return isNaN(dobDate.getTime())
        ? null
        : dobDate.toISOString().split("T")[0];
    })();

    const diagnosisData = {
      _id: selectedUser._id,
      userData: {
        name: selectedUser.name,
        gender: selectedUser.gender || null,
        dob: formattedDob,
        phone: selectedUser.phone || null,
      },
      diagnosis_title: form.diagnosisTitle,
      description: form.description,
      medications: validMedications.map((med) => ({
        medication_name: med.name,
        dosage: med.dosage,
        duration: med.duration,
        notes: "",
      })),
      future_checkups: form.futureCheckupDate
        ? [
            {
              checkup_date: form.futureCheckupDate,
              purpose: form.futureCheckupPurpose || "",
              notes: form.futureCheckupNotes || "",
            },
          ]
        : [],
    };

    try {
      const result = await createDiagnosis(diagnosisData);

      if (result) {
        setSelectedUser(null);
        setForm({
          diagnosisTitle: "",
          description: "",
          medications: [{ name: "", dosage: "", duration: "" }],
          futureCheckupDate: "",
          futureCheckupPurpose: "",
          futureCheckupNotes: "",
        });
        toast.success("Diagnosis created successfully!");
      }
    } catch (error) {
      console.error("Diagnosis submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create diagnosis"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Diagnosis
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Selection */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient *
          </label>
          <select
            value={selectedUser?._id || ""}
            onChange={handleUserSelect}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a patient</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} {user.phone && `(${user.phone})`}
              </option>
            ))}
          </select>
          {selectedUser && (
            <div className="mt-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">Selected:</span>{" "}
                {selectedUser.name}
              </p>
              {selectedUser.gender && (
                <p>
                  <span className="font-medium">Gender:</span>{" "}
                  {selectedUser.gender}
                </p>
              )}
              {selectedUser.dob && (
                <p>
                  <span className="font-medium">DOB:</span>{" "}
                  {new Date(selectedUser.dob).toLocaleDateString()}
                </p>
              )}
              {selectedUser.phone && (
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {selectedUser.phone}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Diagnosis Title */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diagnosis Title *
          </label>
          <input
            name="diagnosisTitle"
            type="text"
            value={form.diagnosisTitle}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Hypertension, Diabetes Type 2"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Detailed description of the diagnosis..."
          />
        </div>

        {/* Medications */}
        <div className="form-group">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800">Medications *</h3>
            <button
              type="button"
              onClick={addMedication}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition"
            >
              + Add Medication
            </button>
          </div>

          {form.medications.map((med, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-md"
            >
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Amoxicillin"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Dosage *
                </label>
                <input
                  type="text"
                  name="dosage"
                  placeholder="e.g., 500mg"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g., 7 days"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, e)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200 transition"
                  disabled={form.medications.length <= 1}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Future Checkup */}
        <div className="form-group">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Future Checkup
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Checkup Date
              </label>
              <input
                type="date"
                name="futureCheckupDate"
                value={form.futureCheckupDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Purpose
              </label>
              <input
                type="text"
                name="futureCheckupPurpose"
                placeholder="e.g., Follow-up, Test Results"
                value={form.futureCheckupPurpose}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm text-gray-700 mb-1">Notes</label>
            <textarea
              name="futureCheckupNotes"
              placeholder="Additional notes for the checkup..."
              value={form.futureCheckupNotes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-md ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } transition flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Diagnosis"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDiagnosis;
