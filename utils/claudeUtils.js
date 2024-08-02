import axios from 'axios';

export async function getClaudeResponse(evaluatedGame) {
  const prompt = `
${JSON.stringify(evaluatedGame, null, 2)}

Analyze the following statistics for Team A and Team B to predict the winner and score of their upcoming MLB game. Consider the relative importance of each stat and how they interact.
Additional Contextual Factors:1. Home/Away: [Which team is home/away]2. Weather conditions: [Brief description]3. Recent performance: [Last 10 games record for each team]4. Head-to-head record this season: [Record]5. Key injuries or roster changes: [Brief description]Based on this data:1. Analyze the offensive strengths and weaknesses of each team.2. Evaluate the pitching matchup and each team's pitching stats.3. Consider the defensive capabilities of each team.4. Factor in the contextual elements like home field advantage and recent performance.5. Identify any significant statistical advantages for either team.Then, provide:1. A prediction of the winner2. A predicted score for each team3. A brief explanation of the key factors that led to this prediction4. A confidence level in your prediction (low, medium, or high)Remember to weigh recent performance more heavily than season-long stats, and consider how specific matchups (e.g., a team's hitting strengths vs. the opposing pitcher's weaknesses) might influence the outcome.

Give more weight to a pitchers recent performances than then pitchers season long stats.
As well as if the teams have a big difference in there run differentials
`;

  try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: "claude-3-opus-20240229",
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
