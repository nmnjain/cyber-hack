// src/components/Simulation/SimulationChallenge.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SimulationDisplay from './SimulationDisplay';
import SimulationTask from './SimulationTask';
import SimulationResult from './SimulationResult';
import simulationsData from '../../data/simulations.json';

function SimulationChallenge() {
    const [currentSimulationIndex, setCurrentSimulationIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // Store answers for *all* simulations
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false); // Track if the current question has been submitted
    const [completed, setCompleted] = useState(false);

    const currentSimulation = simulationsData[currentSimulationIndex];

    const handleAnswerSubmit = (answers) => {
        // Store the answers for the *current* simulation.
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentSimulationIndex]: answers
        }));
        setSubmitted(true); // Mark the question as submitted

         const correctAnswers = currentSimulation.answer || [];
          const correctCount = answers.filter(answer => correctAnswers.includes(answer)).length;

          //Update the score
           const incorrectCount = answers.filter(answer => !correctAnswers.includes(answer)).length;
            if(correctCount > 0 || incorrectCount > 0){
               setScore(prevScore => prevScore + correctCount - incorrectCount);
           }
    };

    const handleNextSimulation = () => {
        if (currentSimulationIndex < simulationsData.length - 1) {
            setCurrentSimulationIndex(currentSimulationIndex + 1);
            setSubmitted(false); // Reset submitted state for the next question
        } else {
            // All simulations completed, show the final result
            setCompleted(true)
            setShowResult(true);
        }
    };

     useEffect(() => { //after every is completed it's automatically be true
           if(completed){
                setShowResult(true);
           }
        }, [completed])


    return (
        <Box sx={{ width: '80%', margin: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom align='center'>
                Cyber Threat Simulation
            </Typography>

            {!showResult && (
                <>
                    <SimulationDisplay
                        simulation={currentSimulation}
                        userAnswers={userAnswers[currentSimulationIndex] || []}
                        submitted={submitted} // Pass submitted state
                    />
                    <SimulationTask
                        simulation={currentSimulation}
                        selectedOptions={userAnswers[currentSimulationIndex] || []} // Pass previous answers
                        onSubmit={handleAnswerSubmit}
                        submitted={submitted} // Pass submitted state
                    />
                     {/* Show "Next Simulation" button only after submission */}
                    {submitted && (
                        <Button variant="contained" color="primary" onClick={handleNextSimulation} sx={{ mt: 2 }}>
                            {currentSimulationIndex < simulationsData.length -1 ? "Next Simulation" : "See Results"}
                        </Button>
                    )}
                </>
            )}

             {showResult && (
                 <SimulationResult
                     score={score}
                     totalQuestions={simulationsData.length}
                     userAnswers = {userAnswers} // Pass all answers for consistency
                 />
             )}

            {showResult && (
                <Button variant="contained" color="primary" onClick={() =>  navigate('/')} sx={{ mt: 2 }}>
                    Back to Home
                </Button>
            )}
        </Box>
    );
}

export default SimulationChallenge;