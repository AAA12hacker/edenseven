import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UseNotification from "../notify/UseNotification";

const LoginForm = ({ onToggleForm, onLoginSuccess }) => {
  const { notifyInfo, notifySuccess, notifyError } = UseNotification();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const loginData = { email, password };
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, loginData);
      const { token, userId, username } = response.data;
      onLoginSuccess(token, userId, username);
      notifySuccess("Logged in successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
      notifyError("Incorrect login email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background pt-16 px-4">
      <div className="text-center p-6 sm:p-8 text-light-text dark:text-dark-text bg-light-background dark:bg-dark-background w-full max-w-lg border-2 border-light-border dark:border-dark-border rounded-3xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">LOGIN FORM</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 sm:mb-6">
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="w-full px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 sm:mb-6">
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="w-full px-4 py-2 bg-light-button2 dark:bg-dark-button2 text-light-text dark:text-dark-text border-2 border-light-border dark:border-dark-border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text font-medium rounded-xl py-2 transition duration-300"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-light-button1h hover:text-light-button1 dark:text-dark-button1 dark:hover:text-dark-button1h font-medium transition duration-300"
            onClick={onToggleForm}
          >
            Register
          </button>
        </p>
      </div>
    </section>
  );
};

export default LoginForm;
