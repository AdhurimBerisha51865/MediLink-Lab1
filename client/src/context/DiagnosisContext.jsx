import { useState, createContext, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "./DoctorContext";

export const DiagnosisContext = createContext();

const DiagnosisContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { dToken } = useContext(DoctorContext);
  const [loading, setLoading] = useState(false);
  const [diagnosisList, setDiagnosisList] = useState([]);

  const createDiagnosis = async (diagnosisData) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/diagnosis/add",
        diagnosisData,
        {
          headers: {
            token: dToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Diagnosis created successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to create diagnosis");
        return false;
      }
    } catch (error) {
      console.error("Diagnosis creation error:", error);

      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to create diagnosis"
        );
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error setting up request. Please try again.");
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDiagnoses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/diagnosis/get-diagnosis",
        {
          headers: {
            token: dToken,
          },
        }
      );

      if (data.success) {
        setDiagnosisList(data.diagnoses);
      } else {
        toast.error(data.message || "Failed to fetch diagnoses");
      }
    } catch (error) {
      console.error("Fetch diagnoses error:", error);
      toast.error("Error fetching diagnoses");
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagnosis = async (id) => {
    try {
      const { data } = await axios.delete(
        backendUrl + `/api/diagnosis/delete-diagnosis/${id}`,
        {
          headers: {
            token: dToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Diagnosis deleted");
        getDiagnoses();
      } else {
        toast.error(data.message || "Failed to delete diagnosis");
      }
    } catch (error) {
      console.error("Delete diagnosis error:", error);
      toast.error("Error deleting diagnosis");
    }
  };

  const updateDiagnosis = async (id, updatedData) => {
    try {
      const res = await axios.put(
        backendUrl + `/api/diagnosis/update-diagnosis/${id}`,
        updatedData,
        {
          headers: {
            token: dToken,
          },
        }
      );
      if (res.data.success) {
        toast.success("Diagnosis updated!");
        getDiagnoses(); // Refresh
      }
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const value = {
    dToken,
    backendUrl,
    loading,
    createDiagnosis,
    getDiagnoses,
    deleteDiagnosis,
    diagnosisList,
    updateDiagnosis,
  };

  return (
    <DiagnosisContext.Provider value={value}>
      {children}
    </DiagnosisContext.Provider>
  );
};

export default DiagnosisContextProvider;
