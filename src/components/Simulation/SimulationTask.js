// src/components/Simulation/SimulationTask.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, FormControl, FormControlLabel, Checkbox, Button } from '@mui/material';

function SimulationTask({ simulation, onSubmit, selectedOptions, submitted }) {
    const [userAnswers, setUserAnswers] = useState(selectedOptions || []); // Initialize with previous answers

    const handleAnswerChange = (event) => {
        const answer = event.target.value;
        if (event.target.checked) {
            setUserAnswers([...userAnswers, answer]);
        } else {
            setUserAnswers(userAnswers.filter(ans => ans !== answer));
        }
    };

      // Reset userAnswers when the simulation changes (using selectedOptions)
    useEffect(() => {
        setUserAnswers(selectedOptions || []);
    }, [selectedOptions]);

    const handleSubmit = () => {
        onSubmit(userAnswers);
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>Task</Typography>
                <Typography variant="body1">{simulation.task}</Typography>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    {simulation.options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            control={<Checkbox
                                        value={option}
                                        onChange={handleAnswerChange}
                                        checked={userAnswers.includes(option)}
                                        disabled={submitted} // Disable after submission
                                    />}
                            label={option}
                        />
                    ))}
                </FormControl>
                {/* Show Submit button only if not yet submitted */}
                {!submitted && (
                    <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
                        Submit
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

export default SimulationTask;