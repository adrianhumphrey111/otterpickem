import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, message: text, gameId } = req.body;
    const isUser = true; // Always set to true as per the requirement

    if (!text || !gameId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      // Fetch the game data
      const game = await prisma.evaluatedGame.findUnique({
        where: { gameId: gameId },
      });

      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      // Create the prompt for the LLM
      const prompt = `
        You are an AI assistant answering questions about an MLB game. Here's the game data and previous analysis:

        Game Data:
        ${JSON.stringify(game.data, null, 2)}

        Previous Analysis:
        ${game.claudeResponse}

        A user is asking the following question about this game:
        "${text}"

        Please provide a response based on the game data and previous analysis. If the question cannot be answered with the given information, please say so.
      `;

      // Here you would send the prompt to your LLM API
      // For this example, we'll use a placeholder response
      // Replace this with your actual LLM API call
      // const llmResponse = await axios.post('YOUR_LLM_API_ENDPOINT', { prompt });
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

      const message = {
        text,
        isUser,
        gameId,
        response: response.data.content[0].text
      };

      // Store the message in the database if needed
      // await prisma.message.create({ data: message });

      res.status(200).json({ 
        message: 'Message received and processed',
        data: message
      });
    } catch (error) {
      console.error('Error processing message:', error);
      res.status(500).json({ error: 'An error occurred while processing the message' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
