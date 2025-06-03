import { createContext } from "react";

export const AdminAppContext = createContext();

const AdminAppContextProvider = ({ children }) => {
  const value = {};

  return (
    <AdminAppContext.Provider value={value}>
      {children}
    </AdminAppContext.Provider>
  );
};

export default AdminAppContextProvider;