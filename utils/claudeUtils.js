import axios from 'axios';

export async function getClaudeResponse(evaluatedGame) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const prompt = `
${JSON.stringify(evaluatedGame)}

Analyze the following statistics for Team A and Team B to predict the winner and score of their upcoming MLB game. Consider the relative importance of each stat, how they interact, and specific scenarios that might influence the outcome.

### Contextual Factors:
1. Head-to-head record this season: [Record]
2. Recent performance: [Last 10 games record for each team]
3. Key injuries or roster changes: [Brief description]
4. Home/Away: [Which team is home/away]
5. Weather conditions: [Brief description]

### Additional Game-Specific Considerations:
1. Series Context: Consider whether this is the final game in a series, and factor in the difficulty of sweeping a series, particularly in favor of the underdog if they have lost the first two games.
2. Betting Line Movement: Review any shifts in betting odds that might indicate market sentiment, especially if it favors the underdog.
3. Motivation and Fatigue: Consider the psychological and physical factors, such as a team’s motivation to avoid a sweep, potential fatigue, or rest days.
4. Situational Statistics: Analyze stats like performance in close games, day vs. night game records, and success against specific types of pitchers (e.g., left-handed vs. right-handed).
5. Underdog Opportunities: Identify scenarios where an underdog might be more likely to win, such as strong recent performance, favorable pitching matchups, or situational advantages.

### Analytical Tasks:
1. **Offensive Analysis:** Assess the offensive strengths and weaknesses of each team, considering recent form and specific matchups.
2. **Pitching Evaluation:** Evaluate the pitching matchup with an emphasis on recent performances, and how each team’s lineup might exploit the opposing pitcher’s weaknesses.
3. **Defensive Review:** Examine the defensive capabilities and any potential vulnerabilities, including errors, fielding range, and catcher performance.
4. **Contextual Impact:** Weigh the influence of home field advantage, recent performance, and series context on the game’s outcome.
5. **Identify Statistical Edges:** Highlight any significant statistical advantages, especially those favoring the underdog in this specific game.

### Deliverables:
1. **Winner Prediction:** Provide a prediction for the winner, taking into account both statistical analysis and situational factors.
2. **Score Prediction:** Predict the score for each team, considering potential scenarios like high-scoring or low-scoring games. And give me an over or under based on your anaylsis and bookmaker odds
3. **Key Factors:** Explain the key factors driving your prediction, emphasizing any underdog advantages or reasons why the favorite might not win.
4. **Confidence Level:** Assign a confidence level (low, medium, high) to your prediction, with an explanation of factors that could lead to an upset or unexpected outcome.
5. ** Give me an upset alert if there may be a decent chance the underdog can make it a close game.

Make These predictions for the first 5 since we are analyszing the starting pitchers
`;

  try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 4000,
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
            'x-api-key': process.env.ANTHROPIC_API_KEY
        }
    });
    return response.data.content[0].text;
  } catch (error) {
    console.error('Error getting Claude response:', error);
    throw error;
  }
}
