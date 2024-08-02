import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, text, gameId } = req.body;
    const isUser = true; // Always set to true as per the requirement

    if (!id || !text || !gameId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      // Here you would typically process the message, perhaps store it in the database
      // and generate a response. For now, we'll just echo back the received message.
      
      const message = {
        id,
        text,
        isUser,
        gameId
      };

      // You can add database operations here if needed
      // For example, storing the message:
      // await prisma.message.create({ data: message });

      res.status(200).json({ 
        message: 'Message received',
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
