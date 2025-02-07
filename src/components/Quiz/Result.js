// src/components/Quiz/Result.js
import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';


function Result({ score, totalQuestions, onRestart,  totalPoints, badge, currentDifficulty }) {
    const percentage = (score / totalQuestions) * 100;


    return (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
            Quiz Result
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
                Total Points: {totalPoints}
            </Typography>
             <Typography variant="h6" gutterBottom>
                Badge: {badge}
            </Typography>
            <Typography variant="h6" gutterBottom>
                Current difficulty: {currentDifficulty}
            </Typography>

            <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
                Share your result:
            </Typography>
            <FacebookShareButton
                url="https://your-app-url.com" // Replace with your app's URL
                quote={`I scored ${score}/${totalQuestions} on the Cybersecurity Quiz at ${currentDifficulty} level! #Cybersecurity #Quiz`}
            >
                <FacebookIcon size={32} round />
            </FacebookShareButton>
            <TwitterShareButton
                url="https://your-app-url.com" // Replace with your app's URL
                title={`I scored ${score}/${totalQuestions} on the Cybersecurity Quiz at ${currentDifficulty} level! #Cybersecurity #Quiz`}
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

export default Result;