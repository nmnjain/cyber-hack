// src/components/Quiz/Quiz.js
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import ScenarioQuestion from './ScenarioQuestion';
import Result from './Result';
import ScenarioResult from './ScenarioResult';
import questionsData from '../../data/questions.json';
import scenarioQuestionsData from '../../data/scenarioQuestions.json';
import './Quiz.css';
import { Box, LinearProgress, Typography } from '@mui/material';
import { updateUserData } from '../../utils/userData';
import { difficultyLevels, calculateBadge, badges, getTimeLimit } from '../../utils/userProgress'; // Import getTimeLimit
import {  scenarioBadges } from '../../utils/scenarioProgress'; // Import for scenario badges
import CompletionScreen from './CompletionScreen';

function Quiz({ userData, quizType }) {
    const [user, setUser] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [totalScenarioPoints, setTotalScenarioPoints] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentDifficulty, setCurrentDifficulty] = useState(difficultyLevels[0]);
    const [badge, setBadge] = useState(badges[0]);  // Regular quiz badge
    const [scenarioBadge, setScenarioBadge] = useState(scenarioBadges[0]); //Scenario badge
    const [showCompletionScreen, setShowCompletionScreen] = useState(false);
    //const [isTimeLimited, setIsTimeLimited] = useState(false); // REMOVED

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

     useEffect(() => {
        if (userData) {
            setTotalPoints(userData.totalPoints);
            setTotalScenarioPoints(userData.totalScenarioPoints); // Load scenario points
            setCurrentDifficulty(userData.difficulty);
            setBadge(userData.badge);
            setScenarioBadge(userData.scenarioBadge); // Load scenario badge

        }
    }, [userData]);

    useEffect(() => {
        let selectedQuestions = [];
        if (quizType === 'regular') {
            selectedQuestions = questionsData.filter(
                (question) => question.difficulty === currentDifficulty
            );
        } else if (quizType === 'scenario') {
            selectedQuestions = scenarioQuestionsData;
        }
        setQuestions(selectedQuestions.sort(() => Math.random() - 0.5));
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setShowCompletionScreen(false);
    }, [currentDifficulty, quizType, userData]); // Add userData as dependency

    const handleAnswer = async (optionIndex, nextQuestion = false) => { // Add nextQuestion parameter

        if(!nextQuestion){ //if nextQuestion is false, run the logic of storing answer
            setSelectedOption(optionIndex);
            const currentQuestion = questions[currentQuestionIndex];
            let pointsEarned = 0;
            // If the user answered correctly (not a timeout), update score and points.
            if (optionIndex !== null && optionIndex === currentQuestion.answer) {
                setScore(score + 1);
                pointsEarned = currentQuestion.points;
            }
             if (quizType === 'regular') {
                const newTotalPoints = totalPoints + pointsEarned;
                 setTotalPoints(newTotalPoints);  // Update local state
                if (user) {
                  await updateUserData(user.uid, { totalPoints: newTotalPoints }); // Update Firestore *only* here
                }
            } else if (quizType === 'scenario') {
                const newTotalScenarioPoints = totalScenarioPoints + pointsEarned;  // Calculate *after* checking answer
                setTotalScenarioPoints(newTotalScenarioPoints); // Update local state
                if (user) {
                    await updateUserData(user.uid, { totalScenarioPoints: newTotalScenarioPoints }); // Update firestore
                }
            }
        }

        // Move to the next question after a delay or immediately if nextQuestion is true
        const timeoutDuration = nextQuestion? 0 : 10000;
        setTimeout(() => {
            setSelectedOption(null); // Clear selected option
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                if (score / questions.length >= 0.5) {
                    setShowCompletionScreen(true);
                    setShowResult(false);
                } else {
                    setShowResult(true);
                    setShowCompletionScreen(false);
                }
            }
        }, timeoutDuration);

    };

    const handleQuizCompletion = async () => { //prepare states
        let newBadge = badge;
        let newScenarioBadge = scenarioBadge;
        let newDifficulty = currentDifficulty;
        const hasPassed = score / questions.length >= 0.5;

        if (quizType === "regular") {
            if (hasPassed) { // Only update if passed
                const currentDifficultyIndex = difficultyLevels.indexOf(currentDifficulty);
                const nextDifficultyIndex = currentDifficultyIndex + 1;
                if (nextDifficultyIndex < difficultyLevels.length) {
                    newDifficulty = difficultyLevels[nextDifficultyIndex];
                }
                 newBadge = calculateBadge(totalPoints); //always calculate badge
            }
        }
         else if (quizType === 'scenario' && hasPassed) {
            newScenarioBadge = "Cybersecurity Ace"; // Set the special badge on pass
        }
        return {newDifficulty, newBadge, newScenarioBadge, hasPassed}
    };

     const handleContinue = async () => {
        const { newDifficulty, newBadge, newScenarioBadge, hasPassed } = await handleQuizCompletion();

        // Only update Firestore if the user passed
        if (hasPassed) {
            if (quizType === 'regular') {
                if (user) {
                    await updateUserData(user.uid, {
                        difficulty: newDifficulty,
                        badge: newBadge,
                    });
                }
            } else if (quizType === 'scenario') {
                if (user) {
                    await updateUserData(user.uid, {
                        scenarioBadge: newScenarioBadge,
                    });
                }
            }
        }

        // Update local state regardless of pass/fail for UI consistency
        setCurrentDifficulty(newDifficulty);
        setBadge(newBadge);
        setScenarioBadge(newScenarioBadge);
        setShowCompletionScreen(false);
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
        setShowCompletionScreen(false);
        setSelectedOption(null);
         let selectedQuestions = [];
        if (quizType === 'regular') {
            selectedQuestions = questionsData.filter(
                (question) => question.difficulty === currentDifficulty
            );
        } else if (quizType === 'scenario') {
            selectedQuestions = scenarioQuestionsData;
        }
        setQuestions(selectedQuestions.sort(() => Math.random() - 0.5));
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    // Get the time limit based on difficulty (only for regular quizzes)
    const timeLimit = quizType === 'regular' ? getTimeLimit(currentDifficulty) : 0;

    return (
        <Box sx={{ width: '80%', margin: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom align='center'>
                {quizType === "regular" ? `Cybersecurity Quiz (${currentDifficulty})` : "Cybersecurity Scenario Quiz"}
            </Typography>

            {/* REMOVED Time Limit Checkbox */}

            {!showResult && !showCompletionScreen && (
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress variant="determinate" value={(currentQuestionIndex + 1) * (100 / questions.length)} />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                            <Typography variant="body2" color="text.secondary">{`${currentQuestionIndex + 1}/${questions.length}`}</Typography>
                        </Box>
                    </Box>
                    {quizType === 'regular' ? (
                        <Question
                            question={questions[currentQuestionIndex]}
                            onAnswer={handleAnswer}
                            selectedOption={selectedOption}
                            key={questions[currentQuestionIndex].id}
                            timeLimit={timeLimit} // Pass time limit directly
                        />
                    ) : (
                        <ScenarioQuestion
                            question={questions[currentQuestionIndex]}
                            onAnswer={handleAnswer}
                            selectedOption={selectedOption}
                            key={questions[currentQuestionIndex].id}
                            timeLimit={30} // Hardcode 30s for scenario
                        />
                    )}
                </>
            )}

            {showCompletionScreen && (
                   <>
                   {quizType === "regular" ?
                    <CompletionScreen
                       badge={quizType === 'regular' ? badge : scenarioBadge} // Display correct badge
                       nextDifficulty={
                           quizType === 'regular'
                               ? difficultyLevels[difficultyLevels.indexOf(currentDifficulty) + 1] || currentDifficulty
                               : null // No difficulty change in scenario mode
                       }
                       onContinue={handleContinue}
                       totalPoints = {quizType === 'regular' ? totalPoints : totalScenarioPoints}
                       currentDifficulty={currentDifficulty}
                       score={score}
                       totalQuestions={questions.length}
                   /> :
                    <CompletionScreen
                    badge={quizType === 'regular' ? badge : scenarioBadge} // Display correct badge
                    nextDifficulty={
                        quizType === 'regular'
                            ? difficultyLevels[difficultyLevels.indexOf(currentDifficulty) + 1] || currentDifficulty
                            : null // No difficulty change in scenario mode
                    }
                    onContinue={handleContinue}
                    totalPoints = {quizType === 'regular' ? totalPoints : totalScenarioPoints}
                    currentDifficulty={currentDifficulty}
                    score={score}
                    totalQuestions={questions.length}
                />}
                   </>

               )}

            {showResult && (
                <>
                    {quizType === 'regular' ? (
                        <Result
                            score={score}
                            totalQuestions={questions.length}
                            onRestart={handleRestart}
                            totalPoints={totalPoints}  // Regular points
                            badge={badge}          // Regular badge
                            currentDifficulty={currentDifficulty}
                            quizType={quizType}
                        />
                    ) : (
                        <ScenarioResult
                            score={score}
                            totalQuestions={questions.length}
                            onRestart={handleRestart}
                            totalScenarioPoints={totalScenarioPoints}  //Scenario points
                        />
                    )}
                </>
            )}
        </Box>
    );
}

export default Quiz;