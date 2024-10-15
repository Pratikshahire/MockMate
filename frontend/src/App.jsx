
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import { Signup } from './Pages/Signup';
import Home from './Pages/Home';
import {DashboardHome} from "./Pages/DashboardHome"
import InterviewSession from './Components/InterviewSession';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/" element={<Home />} />
            <Route path="/interview" element={<InterviewSession />} />
        </Routes>
    </Router>
  );
}

export default App;
