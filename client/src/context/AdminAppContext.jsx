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
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
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