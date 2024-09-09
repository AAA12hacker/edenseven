import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UseNotification from "../notify/UseNotification";

const LogoutButton = ({ setIsAuthenticated }) => {
  const { notifyInfo, notifySuccess, notifyError } = UseNotification();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${apiUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      notifySuccess("Logged out successfully.");
      setIsAuthenticated(false);
      Navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      notifyError("Error logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-4 px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text rounded hover:bg-light-button2h dark:hover:bg-dark-button2h"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
