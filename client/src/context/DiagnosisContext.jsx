import { useState, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DiagnosisContext = createContext();

const DiagnosisContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
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
        // Server responded with a status code that falls out of 2xx range
        toast.error(
          error.response.data.message || "Failed to create diagnosis"
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request
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
        // Refresh the list
        getDiagnoses();
      } else {
        toast.error(data.message || "Failed to delete diagnosis");
      }
    } catch (error) {
      console.error("Delete diagnosis error:", error);
      toast.error("Error deleting diagnosis");
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    loading,
    createDiagnosis,
    getDiagnoses,
    deleteDiagnosis,
    diagnosisList,
  };

  return (
    <DiagnosisContext.Provider value={value}>
      {children}
    </DiagnosisContext.Provider>
  );
};

export default DiagnosisContextProvider;
