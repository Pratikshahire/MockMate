import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email == null) {
      navigate("/login");
    } else {
      const data = {
        userdata: {
          email: email,
        },
      };

      axios.post("http://localhost:3000/user/getUser", data)
        .then(response => {
          setUserData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data.");
          setLoading(false);
        });
    }
  }, [email, navigate]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const [userEmail, userName, userId, reports] = userData;

  const calculateAverageAccuracy = (accuracyArray) => {
    const total = accuracyArray.reduce((acc, curr) => acc + curr, 0);
    return (total / accuracyArray.length).toFixed(2);
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-center text-indigo-600">Welcome, {userName}!</h1>
      <h2 className="text-xl text-center text-gray-600">Your Email: {userEmail}</h2>

      <h3 className="text-2xl font-semibold mt-5 text-green-600">Your Mock Interview Reports:</h3>
      {reports.length === 0 ? (
        <p className="text-center mt-3">No reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
          {reports.map((report, index) => {
            const averageAccuracy = calculateAverageAccuracy(report.accuracy);

            return (
              <div key={index} className={`bg-${index % 2 === 0 ? 'blue' : 'purple'}-100 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105`}>
                <h4 className="text-xl font-semibold mb-2 text-blue-800">Report {index + 1}</h4>
                <p className="font-medium text-gray-800">Total Questions: <span className="font-normal">{report.totalQ}</span></p>
                <p className="font-medium text-gray-800">Questions Answered: <span className="font-normal">{report.QAnswered}</span></p>
                <p className="font-medium text-gray-800">Average Accuracy: <span className="font-normal">{averageAccuracy}%</span></p>
                <p className="font-medium text-gray-800">Final Feedback: <span className="font-normal">{report.finalReport}</span></p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
