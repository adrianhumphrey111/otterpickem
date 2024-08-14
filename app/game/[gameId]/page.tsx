'use client';

import { useState, useEffect, FormEvent } from 'react';
import { EvaluatedGame } from '../../types';

async function getGameDetails(gameId: string) {
  const response = await fetch(`/api/v2/mlb/getGameDetails?gameId=${gameId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch game details');
  }
  return response.json();
}

async function sendMessage(gameId: string, message: string) {
  const response = await fetch('/api/v2/chat/sendMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameId, message }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
}

export default function GameDetails({ params }: { params: { gameId: string } }) {
  const [game, setGame] = useState<EvaluatedGame | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        const gameData = await getGameDetails(params.gameId);
        setGame(gameData);
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError('Error loading game details');
      }
    }

    fetchGameDetails();
  }, [params.gameId]);

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (!game) {
    return <div className="text-center text-gray-800">Loading game details...</div>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const newUserMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newUserMessage]);
    setMessage('');

    try {
      const response = await sendMessage(params.gameId, message);
      const newBotMessage = { role: 'assistant', content: response.data.response };
      setChatHistory(prev => [...prev, newBotMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-black mb-10">
          Game Details
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">
                {game.data.awayTeam.name} vs {game.data.homeTeam.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {new Date(game.data.boxScore.scheduled).toLocaleString()}
              </p>
              <h3 className="text-xl font-semibold mb-2 text-black">Analysis</h3>
              <p className="text-gray-700 whitespace-pre-line">{game.claudeResponse}</p>
            </div>

            {/* Chat section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Chat</h3>
              <div className="mb-4 h-64 overflow-y-auto">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`inline-block p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow border rounded-l-lg p-2 text-black"
                  placeholder="Ask a question about the game..."
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Right panel for game details */}
          <div className="lg:w-1/3">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Game Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-black">{game.data.awayTeam.name}</h4>
                  <p className="text-black">Wins: {game.data.awayTeam.standings.win}</p>
                  <p className="text-black">Losses: {game.data.awayTeam.standings.loss}</p>
                  <p className="text-black">Probable Pitcher: {game.data.boxScore.away.probable_pitcher.full_name}</p>
                  <p className="text-black">ERA: {game.data.boxScore.away.probable_pitcher.era}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-black">{game.data.homeTeam.name}</h4>
                  <p className="text-black">Wins: {game.data.homeTeam.standings.win}</p>
                  <p className="text-black">Losses: {game.data.homeTeam.standings.loss}</p>
                  <p className="text-black">Probable Pitcher: {game.data.boxScore.home.probable_pitcher.full_name}</p>
                  <p className="text-black">ERA: {game.data.boxScore.home.probable_pitcher.era}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
