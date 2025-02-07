// src/components/Quiz/Question.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

function Question({ question, onAnswer, selectedOption, timeLimit }) {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [timerActive, setTimerActive] = useState(true);


     useEffect(() => {
        setTimeLeft(timeLimit); // Reset timer when a new question is displayed
        setTimerActive(true);

        let timerId;
        if (timeLimit > 0) {
            timerId = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timerId);
                        setTimerActive(false); //stop the timer
                        onAnswer(null); // Timeout!  Pass null to indicate no answer.
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        // Cleanup function: Clear the timer when the component unmounts or the question changes.
        return () => clearInterval(timerId);
    }, [timeLimit, onAnswer, question.id]); //question.id added to remount when qs changes

      useEffect(() => {
        if (selectedOption !== null) {
            setTimerActive(false); // Stop the timer if an option is selected
        }
    }, [selectedOption]);

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {question.question}
                </Typography>
                 {/* Display the timer */}
                {timeLimit > 0 && timerActive && (
                    <Typography variant="body1" color="error">
                        Time Left: {timeLeft} seconds
                    </Typography>
                )}
                <Box>
                    {question.options.map((option, index) => (
                        <Button
                            key={index}
                             variant={selectedOption === index ? (index === question.answer ? 'contained' : 'outlined') : 'contained'}
                            color={selectedOption === index ? (index === question.answer ? 'success' : 'error') : selectedOption === null && !timerActive ? 'error' : 'primary'} // Change color on timeout
                            onClick={() => {
                                if (timerActive) {
                                  onAnswer(index)
                                }
                              }
                            }
                            fullWidth
                            sx={{ mt: 1 }}
                            disabled={selectedOption !== null || !timerActive}
                        >
                            {option}
                        </Button>
                    ))}
                </Box>
                {selectedOption !== null && ( // Show explanation if answered
                    <Typography variant="body1" sx={{ mt: 2, color: selectedOption === question.answer ? 'green' : 'red' }}>
                        {question.explanation}
                    </Typography>
                )}
                 {!timerActive && selectedOption === null && ( // Show explanation on timeout
                    <Typography variant="body1" sx={{ mt: 2, color: 'red' }}>
                        Time's up! {question.explanation}
                    </Typography>
                )}
                {!timerActive &&  ( // Next Question button (both cases)
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onAnswer(null, true)} // Pass 'true' to signal moving to the next question
                        sx={{ mt: 2 }}
                    >
                        Next Question
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default Question;