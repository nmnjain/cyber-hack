// src/components/Quiz/ScenarioResult.js
import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function ScenarioResult({ score, totalQuestions, onRestart, totalScenarioPoints }) {
    const percentage = (score / totalQuestions) * 100;
    const scenarioBadge = "Cybersecurity Ace"; // Define the scenario badge

    return (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Scenario Quiz Result
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                {percentage >= 50 ? (
                    <FaCheckCircle style={{ color: 'green', marginRight: '8px', fontSize: '2em' }} />
                ) : (
                    <FaTimesCircle style={{ color: 'red', marginRight: '8px', fontSize: '2em' }} />
                )}
                <Typography variant="h5">
                    Your Score: {score} / {totalQuestions} ({percentage.toFixed(2)}%)
                </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>
                Total Points: {totalScenarioPoints}
            </Typography>
            {/* Conditionally display the badge only if the user passed */}
            {percentage >= 50 && (
                <Typography variant="h6" gutterBottom>
                   Badge: {scenarioBadge}
                </Typography>
             )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Share your result:
                </Typography>
                <FacebookShareButton
                    url="https://your-app-url.com" // Replace!
                    quote={`I scored ${score}/${totalQuestions} on the Cybersecurity Scenario Quiz! #Cybersecurity #Quiz ${percentage >= 50 ? `and earned the ${scenarioBadge} badge!` : ""}`}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url="https://your-app-url.com" // Replace!
                    title={`I scored ${score}/${totalQuestions} on the Cybersecurity Scenario Quiz! #Cybersecurity #Quiz ${percentage >= 50 ? `and earned the ${scenarioBadge} badge!` : ""}`}
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </Box>
            <Button variant="contained" color="primary" onClick={onRestart} sx={{ mt: 3 }}>
                Restart Quiz
            </Button>
        </Paper>
    );
}

export default ScenarioResult;