import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, text, gameId } = req.body;
    const isUser = true; // Always set to true as per the requirement

    if (!id || !text || !gameId) {
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
      const llmResponse = { data: { response: "This is a placeholder response. Replace with actual LLM API call." }};

      const message = {
        id,
        text,
        isUser,
        gameId,
        response: llmResponse.data.response
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
