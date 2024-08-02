'use client';

import React, { useState, useEffect } from 'react';
import { EvaluatedGame } from '../../types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  gameId: string;

}

async function getGameDetails(gameId: string) {
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not defined');
  }

  const response = await fetch(`${baseUrl}/api/v2/mlb/getGameDetails?gameId=${gameId}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }
  return response.json();
}

export default function GameDetails({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId;
  const [game, setGame] = useState<EvaluatedGame | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  React.useEffect(() => {
    async function fetchGameDetails() {
      try {
        const gameData = await getGameDetails(gameId);
        setGame(gameData);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setError('Error loading game details');
      }
    }
    fetchGameDetails();
  }, [gameId]);

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        isUser: true,
        gameId: gameId, // Add gameId to the message object
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      try {
        const response = await fetch('/api/v2/chat/sendMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage), // Send the entire newMessage object
        });

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const data = await response.json();
        console.log('Server response:', data);

        // Here you can handle the bot's response if needed
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!game) {
    return <div className="text-center text-gray-800">Loading game details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-7xl mx-auto flex-grow">
        <h1 className="text-3xl font-extrabold text-center text-black mb-10">
          Game Details
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                {game.data.awayTeam.name} vs {game.data.homeTeam.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(game.data.boxScore.scheduled).toLocaleString()}
              </p>
              <h3 className="text-xl font-semibold mb-2 text-black">Analysis</h3>
              <p className="text-gray-700 whitespace-pre-line">{game.claudeResponse}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* ... (keep the existing sidebar content) */}
          </div>
        </div>
      </div>

      {/* Chat interface for desktop */}
      <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center">
          <input
            type="text"
            placeholder="Ask about this game..."
            className="flex-grow border rounded-full py-2 px-4 mr-2 text-black"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            className="bg-blue-500 text-white rounded-full p-2"
            onClick={handleSendMessage}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
