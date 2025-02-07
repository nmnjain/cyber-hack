import React from 'react';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';

function SimulationDisplay({ simulation, userAnswers, submitted }) {
    if (!simulation) {
        return <Typography>Loading simulation...</Typography>;
    }

    const correctAnswers = simulation.answer || [];

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {simulation.type === "phishing" ? "Phishing Email" : "Fake Social Media Profile"}
                </Typography>
                
                {simulation.type === "phishing" && (
                    <>
                        <Typography variant="subtitle1">Subject: {simulation.email_subject}</Typography>
                        <Typography variant="body1" paragraph>
                            {simulation.email_body.split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}<br />
                                </React.Fragment>
                            ))}
                        </Typography>
                    </>
                )}
                
                {simulation.type === "social_media" && (
                    <>
                        <Typography variant="subtitle1">Profile Name: {simulation.profile_name}</Typography>
                        <Typography variant="body1" paragraph>Message: {simulation.profile_message}</Typography>
                    </>
                )}

                {submitted && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom color="primary">
                            Feedback:
                        </Typography>
                        
                        {/* Red Flags (Correct Answers) Section */}
                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main' }}>
                            Red Flags in this {simulation.type === "phishing" ? "Email" : "Profile"}:
                        </Typography>
                        {correctAnswers.map((option, index) => (
                            <Box key={index} sx={{ mt: 1, ml: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {option}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                    {simulation.explanations[option]}
                                </Typography>
                            </Box>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        {/* Non-Red Flags Section */}
                        <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold', color: 'text.secondary' }}>
                            These are NOT Red Flags:
                        </Typography>
                        {simulation.options
                            .filter(option => !correctAnswers.includes(option))
                            .map((option, index) => (
                                <Box key={index} sx={{ mt: 1, ml: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {option}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        {simulation.explanations[option]}
                                    </Typography>
                                </Box>
                            ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default SimulationDisplay;