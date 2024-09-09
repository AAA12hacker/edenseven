import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import ScriptForm from "./components/script/ScriptForm";
import ScriptsList from "./components/script/ScriptsList";
import ScriptEditForm from "./components/script/ScriptEditForm";
import LoginForm from "./components/user/LoginForm";
import RegisterForm from "./components/user/RegisterForm";
import Recommendations from "./components/script/Recommendations";
import UserDashboard from "./components/user/UserDashboard";
import LogoutButton from "./components/user/LogoutButton";
import PomodoroTimer from "./components/script/PomodoroTimer";
import Navbar from "./components/script/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import UseNotification from "./components/notify/UseNotification";

const App = () => {
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const { notifyInfo, notifySuccess, notifyError } = UseNotification();
  const [scripts, setScripts] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [completeScript, setCompleteScript] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    console.log({ token, userId });
    if (token && userId && storedUsername) {
      setIsAuthenticated(true);
      setUserId(userId);
      setUsername(storedUsername);
      fetchScripts();
    }
  }, []);
  useEffect(() => {
    if (isAuthenticated) {
      fetchScripts(); // Fetch the scripts only if authenticated
    }
  }, [isAuthenticated]);

  const fetchScripts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/scripts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setScripts(response.data);
    } catch (error) {
      console.error("Error fetching scripts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScript = async (newScript) => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/scripts`, newScript, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setScripts([...scripts, response.data]);
      navigate("/");
    } catch (error) {
      console.error("Error creating script:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScript = async (updatedScript) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${apiUrl}/api/scripts/${updatedScript._id}`,
        updatedScript,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedScripts = scripts.map((script) =>
        script._id === response.data._id ? response.data : script
      );
      setScripts(updatedScripts);
      setSelectedScript(null);
    } catch (error) {
      console.error("Error updating script:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScript = async (scriptId) => {
    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/scripts/${scriptId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const updatedScripts = scripts.filter(
        (script) => script._id !== scriptId
      );
      setScripts(updatedScripts);
    } catch (error) {
      console.error("Error deleting script:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (script) => {
    setSelectedScript(script);
  };

  const handleMarkComplete = async (scriptId) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${apiUrl}/api/scripts/${scriptId}/completed`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const updatedScripts = scripts.map((script) =>
        script._id === response.data._id ? response.data : script
      );
      setScripts(updatedScripts);
      fetchScripts();
      notifySuccess("Task is completed");
    } catch (error) {
      console.error("Error marking script as completed:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginSuccess = (token, userId, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUserId(userId);
    setUsername(username);
    navigate("/");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };
  //   if (loading) {
  //     return (
  //       <>
  //         <h1>Loading</h1>
  //       </>
  //     );
  //   }

  return (
    <div className="min-h-screen bg-grey-900">
      <ToastContainer />
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {!isAuthenticated ? (
        isLogin ? (
          <LoginForm
            onToggleForm={toggleAuthForm}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <RegisterForm onToggleForm={toggleAuthForm} />
        )
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <ScriptsList
                scripts={scripts}
                onEditClick={handleEditClick}
                onDelete={handleDeleteScript}
                onMarkComplete={handleMarkComplete}
              />
            }
          />
          <Route
            path="/create"
            element={<ScriptForm onSubmit={handleCreateScript} />}
          />
          <Route
            path="/edit/:id"
            element={
              selectedScript ? (
                <ScriptEditForm
                  script={selectedScript}
                  onUpdate={handleUpdateScript}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route
            path="/logout"
            element={<LogoutButton onLogout={handleLogout} />}
          />
          <Route
            path="/dashboard"
            element={<UserDashboard userId={userId} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
