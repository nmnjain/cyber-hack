// src/utils/scenarioProgress.js
export const scenarioBadges = ["Scenario Starter", "Scenario Solver", "Scenario Sentinel"];
export const scenarioPointsToNextBadge = 30; // Points to upgrade in scenario mode

export function calculateScenarioBadge(totalScenarioPoints) {
    if (totalScenarioPoints >= scenarioPointsToNextBadge * 2) {
        return scenarioBadges[2];
    } else if (totalScenarioPoints >= scenarioPointsToNextBadge) {
        return scenarioBadges[1];
    } else {
        return scenarioBadges[0];
    }
}