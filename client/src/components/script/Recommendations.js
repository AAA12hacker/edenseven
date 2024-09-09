import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UseNotification from "../notify/UseNotification";

const Recommendations = () => {
  const { notifyInfo, notifySuccess, notifyError } = UseNotification();
  const apiUrl = process.env.REACT_APP_BACKEND_URL;
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/recommendations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to fetch recommendations, Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecommendation = async (
    scriptId,
    scriptName,
    scriptContent
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/recommendations/${scriptId}`,
        {
          name: scriptName,
          content: scriptContent,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRecommendations([...recommendations, response.data]);
      notifySuccess("Task added successfully!");

      navigate("/");
    } catch (error) {
      console.error("Error adding recommendation:", error);
      notifyError("Error adding recommendation, Try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-6 text-red-600">{error}</div>;
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-light-background dark:bg-dark-background pt-16 px-4 sm:px-6 ">
      <div className="p-4 sm:p-6 lg:p-8 bg-light-background dark:bg-dark-background w-full max-w-4xl border-4 border-light-border dark:border-dark-border rounded-3xl shadow-lg">
        <div className="overflow-y-auto max-h-80vh bg-light-navbg dark:bg-dark-navbg p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-light-button2 scrollbar-track-light-navbg dark:scrollbar-thumb-dark-button2 dark:scrollbar-track-dark-navbg rounded-xl shadow-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-light-heading dark:text-dark-heading">
            Recommendations
          </h2>
          {recommendations.length > 0 ? (
            <ul className="space-y-4">
              {recommendations.map((script) => (
                <li
                  key={script._id}
                  className="flex flex-col sm:flex-row justify-between items-center p-4 bg-light-button2 hover:bg-light-button2h dark:bg-dark-button2 dark:hover:bg-dark-button2h rounded-md shadow-md"
                >
                  <div className="flex flex-col flex-grow text-light-text dark:text-dark-text">
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {script.name}
                    </h3>
                    <p className="text-sm">
                      Last Used At:{" "}
                      {new Date(script.lastUsedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleAddRecommendation(
                        script._id,
                        script.name,
                        script.content
                      )
                    }
                    className="mt-2 sm:mt-0 bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text py-2 px-4 rounded-lg transition duration-300"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-400">
              No recommendations available
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-light-button1 hover:bg-light-button1h dark:bg-dark-button1 dark:hover:bg-dark-button1h text-light-text dark:text-dark-text py-2 rounded-lg transition duration-300"
        >
          Go back
        </button>
      </div>
    </section>
  );
};

export default Recommendations;
