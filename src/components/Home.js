// src/components/Home.js
import React from 'react';
import { Button, Typography, Box, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home({ userData }) {
    const navigate = useNavigate();

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h3" align="center" gutterBottom>
                    Welcome to CyberSafe Quiz!
                </Typography>
                <Typography variant="h6" align="center" paragraph>
                    Test your cybersecurity knowledge with our quizzes and realistic threat simulations!
                </Typography>
                {userData && (
                    <>
                        <Typography variant="h6" color="textSecondary" align="center" paragraph>
                            Current Difficulty: {userData.difficulty} | Current Badge: {userData.badge}
                        </Typography>
                        <Typography variant="h6" color="textSecondary" align="center" paragraph>
                            Scenario Badge: {userData.scenarioBadge}
                        </Typography>
                    </>
                )}

                <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={() => navigate('/quiz', { state: { quizType: 'regular' } })}
                            disabled={userData && userData.difficulty === "Advanced" && userData.badge === "Cyber Guardian"}
                        >
                            Start Regular Quiz
                        </Button>
                        {userData && userData.difficulty === "Advanced" && userData.badge === "Cyber Guardian" && (
                            <Typography variant="body2" color="textSecondary">
                                You have completed the regular quiz!
                            </Typography>
                        )}
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={() => navigate('/quiz', { state: { quizType: 'scenario' } })}
                            disabled={userData && userData.scenarioBadge === "Cybersecurity Ace"}
                        >
                            Start Scenario Quiz
                        </Button>
                        {userData && userData.scenarioBadge === "Cybersecurity Ace" && (
                            <Typography variant="body2" color="textSecondary">
                                You have completed the scenario quiz!
                            </Typography>
                        )}
                    </Grid>
                    {/* New Button for Threat Simulations */}
                    <Grid item>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={() => navigate('/simulation')} // NEW ROUTE
                        >
                            Start Cyber Threat Simulation
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default Home;