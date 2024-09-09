import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import LogoutButton from "./LogoutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import UseNotification from "../notify/UseNotification";
Chart.register(...registerables);

const UserDashboard = ({ userId }) => {
  const { notifyInfo, notifySuccess, notifyError } = UseNotification();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const [stats, setStats] = useState({
    loginTimestamps: [],
    taskCompletionTimestamps: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState("week"); // Default to week
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get(`${apiUrl}/userstats/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserDetails(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserStats();
    fetchUserDetails();
  }, [userId]);

  const handleEditUser = async () => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/auth/${userId}`,
        userDetails,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUserDetails(response.data.user);
      notifySuccess("User details updated!");
      setEditMode(false);
    } catch (error) {
      notifyError("Error updating user.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(`${apiUrl}/api/auth/${userId}/password`, passwords, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChangePasswordMode(false);
      notifySuccess("Password changed successfully!");
    } catch (error) {
      setError(error.message);
      notifyError("Error changing password.");
    }
  };

  const handleDeleteUser = async () => {
    try {
      alert("Do you confirm to delete this Account?");
      await axios.delete(`${apiUrl}/api/auth/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      notifySuccess("User deleted successfully!");
    } catch (error) {
      setError(error.message);
      notifyError("Error deleting user, Try again later.");
    }
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error)
    return <p className="text-center text-xl text-red-600">Error: {error}</p>;

  const getTimeLabels = (interval) => {
    const labels = [];
    const now = new Date();

    if (interval === "week") {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      for (let i = 0; i < 7; i++) {
        labels.push(
          new Date(startOfWeek).toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })
        );
        startOfWeek.setDate(startOfWeek.getDate() + 1);
      }
    } else if (interval === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(
          new Date(startOfMonth.setDate(i)).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })
        );
      }
    } else if (interval === "year") {
      for (let i = 0; i < 12; i++) {
        labels.push(
          new Date(now.getFullYear(), i, 1).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        );
      }
    } else if (interval === "daily") {
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
      }
    }

    return labels;
  };

  const filterTimestamps = (timestamps, interval) => {
    const now = new Date();

    if (interval === "daily") {
      return timestamps.filter((timestamp) => {
        const date = new Date(timestamp);
        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    }

    return timestamps;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };

  const createChartData = (timestamps, interval) => {
    const labels = getTimeLabels(interval);
    const data = new Array(labels.length).fill(0);
    const filteredTimestamps = filterTimestamps(timestamps, interval);

    filteredTimestamps.forEach((timestamp) => {
      const date = new Date(timestamp);
      let timeKey;

      if (interval === "week") {
        timeKey = date.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });
      } else if (interval === "month") {
        timeKey = date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });
      } else if (interval === "year") {
        timeKey = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      } else if (interval === "daily") {
        timeKey = `${date.getHours()}:00`;
      }

      const index = labels.indexOf(timeKey);
      if (index !== -1) {
        data[index]++;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Frequency",
          data,
          borderColor: "#4a90e2",
          backgroundColor: "rgba(74, 144, 226, 0.2)",
          borderWidth: 3,
          pointRadius: 6,
          pointBackgroundColor: "#4a90e2",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          lineTension: 0.3,
        },
      ],
    };
  };

  const getMaxYAxis = (interval) => {
    switch (interval) {
      case "week":
        return 20;
      case "month":
        return 100;
      case "year":
        return 300;
      case "daily":
        return 10;
      default:
        return 10;
    }
  };

  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: getMaxYAxis(interval),
        grid: {
          color: "#fff",
          borderColor: "#aaa",
          borderWidth: 1,
        },
        ticks: {
          stepSize: getMaxYAxis(interval) / 10,
          color: "#fff",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#fff",
          font: {
            size: 16,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return ` ${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  return (
    <div className="p-4 md:p-8 bg-light-background dark:bg-dark-background mt-[60px] text-light-text dark:text-dark-text min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold">
          <FontAwesomeIcon icon={faChartLine} className="mr-2" />
          User Insights
        </h1>
        {/* <LogoutButton onClick={handleLogout} /> */}
      </div>
      <div className="mb-8 flex justify-center">
        <label htmlFor="interval" className="text-lg mr-4">
          Select Time Interval:
        </label>
        <select
          id="interval"
          value={interval}
          onChange={handleIntervalChange}
          className="p-2  bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text  rounded"
        >
          <option value="daily">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="year">Yearly</option>
        </select>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-light-button2 dark:bg-dark-button2 p-4 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            User Activity Graph
          </h2>
          <Line
            data={createChartData(stats.loginTimestamps, interval)}
            options={chartOptions}
          />
        </div>

        <div className="flex-1 bg-light-button2 dark:bg-dark-button2 p-4 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            Task Completion Graph
          </h2>
          <Line
            data={createChartData(stats.taskCompletionTimestamps, interval)}
            options={chartOptions}
          />
        </div>
      </div>

      <div className="mt-6 bg-light-background dark:bg-dark-background p-4 rounded-lg shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">User Details</h2>
        {editMode ? (
          <div>
            <input
              type="text"
              value={userDetails.username}
              onChange={(e) =>
                setUserDetails({ ...userDetails, username: e.target.value })
              }
              placeholder="Username"
              className="mb-2 px-3 py-1 border  bg-light-button2 dark:bg-dark-button2 border-light-border dark:border-dark-border rounded w-full"
            />
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              placeholder="Email"
              className="mb-2 px-3 py-1 border  bg-light-button2 dark:bg-dark-button2 border-light-border dark:border-dark-border rounded w-full"
            />
            <input
              type="number"
              value={userDetails.phone}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phone: e.target.value })
              }
              placeholder="Phone"
              className="mb-4 px-3 py-1 border  bg-light-button2 dark:bg-dark-button2 border-light-border dark:border-dark-border rounded w-full"
            />
            <button
              onClick={handleEditUser}
              className="px-4 py-2 bg-light-button1 dark:bg-dark-button1 text-white rounded hover:bg-light-button1h dark:hover:bg-dark-button1h"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="ml-4 px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text rounded hover:bg-light-button2h dark:hover:bg-dark-button2h"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium">
              Username: {userDetails.username}
            </p>
            <p className="text-lg font-medium">Email: {userDetails.email}</p>
            <p className="text-lg font-medium">Phone: {userDetails.phone}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-4 px-4 py-2 bg-light-button1 dark:bg-dark-button1 text-white rounded hover:bg-light-button1h dark:hover:bg-dark-button1h"
            >
              Edit Details
            </button>
            <button
              onClick={() => setChangePasswordMode(true)}
              className="ml-4 px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text rounded hover:bg-light-button2h dark:hover:bg-dark-button2h"
            >
              Change Password
            </button>
            {/* <button
                            onClick={handleDeleteUser}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete Account
                        </button> */}
          </div>
        )}
      </div>

      {changePasswordMode && (
        <div className="mt-6 bg-light-background dark:bg-dark-background border-2 border-light-border dark:border-dark-border p-4 rounded-lg shadow-md">
          <h2 className="text-xl text-light-text dark:text-dark-text md:text-2xl font-semibold mb-4">
            Change Password
          </h2>
          <input
            type="password"
            value={passwords.oldPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, oldPassword: e.target.value })
            }
            placeholder="Old Password"
            className="mb-2 px-3 text-light-text dark:text-dark-text py-1 border bg-light-button2 dark:bg-dark-button2  border-light-border dark:border-dark-border rounded w-full"
          />
          <input
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            placeholder="New Password"
            className="mb-4 px-3  text-light-text dark:text-dark-text py-1 border  bg-light-button2 dark:bg-dark-button2 border-light-border dark:border-dark-border rounded w-full"
          />
          <button
            onClick={handleChangePassword}
            className="px-4 py-2 text-light-text dark:text-dark-text bg-light-button1 dark:bg-dark-button1  rounded hover:bg-light-button1h dark:hover:bg-dark-button1h"
          >
            Change Password
          </button>
          <button
            onClick={() => setChangePasswordMode(false)}
            className="ml-4 px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text rounded hover:bg-light-button2h dark:hover:bg-dark-button2h"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
