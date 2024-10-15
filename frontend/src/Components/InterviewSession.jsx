import React, { useState, useEffect } from 'react';
import botImage from '../assets/bot.jpeg';

const InterviewSession = () => {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isInterviewComplete, setInterviewComplete] = useState(false);
  const [ssocket, setSsocket] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);  // Timer starts from 0
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Control timer state

  useEffect(() => {
    fetch('http://localhost:3000/gemini/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: localStorage.getItem("email") })
    })
      .then(response => response.text())
      .then(data => {
        const socket = new WebSocket('ws://localhost:8000');
        setSsocket(socket);

        socket.onopen = () => {
          console.log('WebSocket connection established.');
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.question) {
            setQuestion(data.question);  // First question arrives
            setIsTimerRunning(true);  // Start the timer when first question arrives
          } else if (data.message) {
            console.log(data.message);
            setInterviewComplete(true);  // End the interview
            setIsTimerRunning(false);    // Stop the timer when interview is complete
          }
        };

        socket.onclose = () => {
          console.log('WebSocket connection closed.');
        };

        return () => {
          socket.close();
        };
      });
  }, []);

  useEffect(() => {
    let timerInterval = null;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);  // Start counting when timer is active
      }, 1000);
    }

    // Clean up the interval on component unmount or when the timer stops
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (ssocket && ssocket.readyState === WebSocket.OPEN) {
      ssocket.send(JSON.stringify({ answer }));
      setAnswer('');
    } else {
      console.error('WebSocket is not open.');
    }
  };

  // Helper function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="SessionComp h-[100vh] flex flex-col items-center justify-center p-4">
      <div className="bg-gray-100 h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6 text-white">MockMate</h1>

        {/* Centered Timer Display */}
        {question && (  // Show timer only after the first question appears
          <div className="absolute top-6 text-2xl font-semibold text-blue-600 bg-white p-2 rounded-lg shadow-lg border border-blue-200">
            ⏳ {formatTime(timeElapsed)}
          </div>
        )}

        {!isInterviewComplete ? (
          <>
            {question ? (
              <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative">
                <img src={botImage} alt="Bot" className="bot-icon" />
                <p className="text-lg mb-4 text-dark-gray"><strong>Bot:</strong> {question}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer"
                    className="w-full p-2 input border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                    Submit Answer
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="relative flex flex-col items-center justify-center">
                  <img className="bot-icon-1 hover:scale-105 transition-all duration-500" src={botImage} alt="Bot" />
                  <div className="animated-loader mt-[2rem]" style={{ marginTop: "3rem" }}></div>
                  <p className="text-light-gray text-lg mt-6 font-semibold animate-pulse">
                    Waiting for the first question...
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <p className="text-green-500 text-xl font-semibold">The interview is complete. Thank you for participating!</p>
        )}
      </div>
    </div>
  )
}

export default InterviewSession;
