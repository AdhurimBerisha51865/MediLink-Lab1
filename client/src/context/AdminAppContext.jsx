import { createContext } from "react";

export const AdminAppContext = createContext();

const AdminAppContextProvider = ({ children }) => {
  const currency = "€";

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    if (!slotDate || typeof slotDate !== "string") return "-";

    const date = new Date(slotDate);
    if (isNaN(date)) return slotDate;

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatSlotTime = (slotTime) => {
    if (!slotTime || typeof slotTime !== "string") return "-";
    const [hours, minutes] = slotTime.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    let displayHour = h % 12;
    if (displayHour === 0) displayHour = 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  const value = {
    calculateAge,
    slotDateFormat,
    currency,
  };

  return (
    <AdminAppContext.Provider value={value}>
      {children}
    </AdminAppContext.Provider>
  );
};

export default AdminAppContextProvider;
