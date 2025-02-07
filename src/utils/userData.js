// src/utils/userData.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { difficultyLevels, badges } from "./userProgress";
import { scenarioBadges } from "./scenarioProgress";

// Fetch user data from Firestore.  NO default values here.
export const getUserData = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null; // Return null if the document doesn't exist
    }
};

// Initialize user data ONLY when creating a new user.
export const initializeUserData = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, {
        difficulty: difficultyLevels[0],  // Beginner
        badge: badges[0],               // Cyber Noob
        totalPoints: 0,
        scenarioBadge: scenarioBadges[0], // Scenario Starter
        totalScenarioPoints: 0,
    }, { merge: true });
};

// Update user data in Firestore.
export const updateUserData = async (userId, data) => {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
};