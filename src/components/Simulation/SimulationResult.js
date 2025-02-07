// src/components/Simulation/SimulationResult.js
import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

 function SimulationResult({ score, totalQuestions, userAnswers }) {
 const isPassed = score > (totalQuestions*2);
 let badge = "";
 let motivation = "";

  if (isPassed){
       badge = "Cybersecurity Sleuth" //The badge displayed to the user
       motivation = "Great job! You did well!";
     }
     else{
       badge = "Cybersecurity Apprentice" //The badge displayed to the user
       motivation = "Keep improving!";
     }
 const percentage = (score / totalQuestions) * 100
 return (
     <Card variant="outlined">
         <CardContent>
             <Typography variant="h4" gutterBottom>
                 Simulation Result
             </Typography>
             <Typography variant="h6" gutterBottom>Results</Typography>

             {isPassed ? (
                 <Typography variant="body1">You are a {badge}! You aced it! {score} points {motivation} </Typography>
             ) : (
                 <Typography variant="body1">You are a {badge}! You can still improve. {motivation} You got {score} points</Typography>
             )}

            </CardContent>
     </Card>
 );
}

export default SimulationResult;