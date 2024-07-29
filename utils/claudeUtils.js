import axios from 'axios';

export async function getClaudeResponse(evaluatedGame) {
  const prompt = `Analyze the following MLB game data and provide insights:
${JSON.stringify(evaluatedGame, null, 2)}

Please provide:
1. A brief summary of the game
2. Key statistics for both teams
3. Notable player performances
4. Any interesting trends or patterns
5. A prediction for the game outcome with reasoning

Limit your response to 500 words.`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/completions',
      {
        model: 'claude-v1',
        prompt: prompt,
        max_tokens_to_sample: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.CLAUDE_API_KEY,
        },
      }
    );

    return response.data.completion;
  } catch (error) {
    console.error('Error getting Claude response:', error);
    throw error;
  }
}
