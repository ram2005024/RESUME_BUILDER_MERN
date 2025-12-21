import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const userContext = createContext();
export const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");
  const [allResumes, setAllResumes] = useState([]);

  //Getting user and then resume by userID
  useEffect(() => {
    const getUser = async () => {
      //Getting user detail
      try {
        const userResponse = await axios.get(
          import.meta.env.VITE_API_URL + "auth/user/data",
          {
            withCredentials: true,
          }
        );
        if (userResponse.data.success) {
          setUserID(userResponse.data.userID);
          setUserName(userResponse.data.userName);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);

  return (
    <userContext.Provider
      value={{
        userName,
        userID,
        allResumes,
        setAllResumes,
      }}
    >
      {children}
    </userContext.Provider>
  );
};
