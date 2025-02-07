// src/components/Quiz/CompletionScreen.js
import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import { FaCheckCircle } from 'react-icons/fa';

function CompletionScreen({ badge, nextDifficulty, onContinue, totalPoints, currentDifficulty, score, totalQuestions }) {
    return (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Congratulations!
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <FaCheckCircle style={{ color: 'green', marginRight: '8px', fontSize: '2em' }} />
                <Typography variant="h5">
                    Your Score: {score} / {totalQuestions}
                </Typography>
            </Box>

            <Typography variant="h6" gutterBottom>
                You've earned the {badge} badge!
            </Typography>
            <Typography variant="h6" gutterBottom>
                Total points: {totalPoints}
            </Typography>
            <Typography variant="h6" gutterBottom>
                You've unlocked the {nextDifficulty} difficulty!
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1">Share your achievement:</Typography>
                <FacebookShareButton
                    url="https://your-app-url.com"  // Replace!
                    quote={`I completed the ${currentDifficulty} level of the Cybersecurity Quiz and earned the ${badge} badge! #Cybersecurity #Quiz`}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url="https://your-app-url.com"  // Replace!
                    title={`I completed the ${currentDifficulty} level of the Cybersecurity Quiz and earned the ${badge} badge! #Cybersecurity #Quiz`}
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
            </Box>

            <Button variant="contained" color="primary" onClick={onContinue} sx={{ mt: 3 }}>
                Continue to {nextDifficulty}
            </Button>
        </Paper>
    );
}

export default CompletionScreen;