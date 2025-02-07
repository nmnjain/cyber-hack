// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; // Import useLocation
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Quiz from './components/Quiz/Quiz';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUserData, initializeUserData } from './utils/userData';
import SimulationChallenge from './components/Simulation/SimulationChallenge'; // Import simulation


const theme = createTheme();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [userData, setUserData] = useState(null); // Store fetched data

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const data = await getUserData(currentUser.uid);
        // If no data, *then* initialize
        if (!data) {
          await initializeUserData(currentUser.uid);
          setUserData(await getUserData(currentUser.uid)); // Fetch *after* initializing
        } else {
          setUserData(data); // Set user data
        }

      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false); // Set loading to false after auth check
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {user && <Navbar userData={userData} />} {/* Pass userData to Navbar */}
        <Routes>
          <Route path="/" element={user ? <Home userData={userData} /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
          {/* Pass quizType to Quiz component */}
          <Route path="/quiz" element={user ? <QuizWrapper userData={userData} /> : <Navigate to="/login" replace />} />
          {/* Route for the SimulationChallenge */}
          <Route path="/simulation" element={user ? <SimulationChallenge /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

// Wrapper component to get quizType from location state
function QuizWrapper({ userData }) {
  const location = useLocation();
  const quizType = location.state?.quizType || 'regular'; // Default to 'regular'

  return <Quiz userData={userData} quizType={quizType} />;
}

export default App;