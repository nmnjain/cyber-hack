// src/utils/userProgress.js
export const difficultyLevels = ["Beginner", "Intermediate", "Advanced"];
export const badges = ["Cyber Noob", "Cyber Warrior", "Cyber Guardian"];
export const pointsToNextBadge = 25; // Points needed to upgrade badge
export const pointsToUnlockIntermediate = 30;  // Example values
export const pointsToUnlockAdvanced = 75;

// NEW: Get time limit based on difficulty
export const getTimeLimit = (difficulty) => {
    switch (difficulty) {
        case "Beginner":
            return 15; // 15 seconds for Beginner
        case "Intermediate":
            return 25; // 25 seconds for Intermediate
        case "Advanced":
            return 35; // 35 seconds for Advanced
        default:
            return 15; // Default to 15 seconds
    }
};

export function calculateBadge(totalPoints) {
    if (totalPoints >= pointsToNextBadge * 2) {
        return badges[2]; // Cyber Guardian
    } else if (totalPoints >= pointsToNextBadge) {
        return badges[1]; // Cyber Warrior
    } else {
        return badges[0]; // Cyber Noob
    }
}


export function getNextDifficulty(currentDifficulty, totalPoints) {
    if (currentDifficulty === "Beginner" && totalPoints >= pointsToUnlockIntermediate) {
        return "Intermediate";
    } else if (currentDifficulty === "Intermediate" && totalPoints >= pointsToUnlockAdvanced) {
        return "Advanced";
    }
    return currentDifficulty; // No change
}

export function getNextBadgePoints(totalPoints) {
    if (totalPoints >= pointsToNextBadge * 2) {
        return 0; // Already at the highest badge
    } else if (totalPoints >= pointsToNextBadge) {
        return pointsToNextBadge * 2 - totalPoints;
    }
    else {
        return pointsToNextBadge - totalPoints;
    }
}