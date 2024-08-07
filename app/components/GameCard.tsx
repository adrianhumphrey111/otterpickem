import React from 'react';
import Link from 'next/link';
import { EvaluatedGame } from '../types';

interface GameCardProps {
  game: EvaluatedGame;
  isGameOfTheDay?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, isGameOfTheDay = false }) => {
  const { data: gameData } = game;
  const awayTeamName = gameData.awayTeam.name;
  const homeTeamName = gameData.homeTeam.name;

  return (
    <article className="w-full max-w-sm mx-auto mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="w-full sm:w-5/12 text-center sm:text-left mb-2 sm:mb-0">
          <h2 className="text-sm font-bold text-blue-600">{awayTeamName}</h2>
          <p className="text-xs text-gray-500">{gameData.awayTeam.market}</p>
        </div>
        <div className="w-full sm:w-2/12 text-center mb-2 sm:mb-0">
          <span className="text-lg font-bold text-red-500">@</span>
          <p className="text-xs text-gray-500">
            {gameData.boxScore.scheduled ? new Date(gameData.boxScore.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
          </p>
        </div>
        <div className="w-full sm:w-5/12 text-center sm:text-right">
          <h2 className="text-sm font-bold text-blue-600">{homeTeamName}</h2>
          <p className="text-xs text-gray-500">{gameData.homeTeam.market}</p>
        </div>
      </div>
      <div className="text-xs text-gray-700 text-center mb-3">
        <span className="font-semibold text-purple-600">Pitchers:</span> {gameData.boxScore?.away?.probable_pitcher?.full_name || 'TBA'} vs {gameData.boxScore?.home?.probable_pitcher?.full_name || 'TBA'}
      </div>
      <p className="text-sm text-gray-800 mb-4 h-20 overflow-y-auto">
        {game.claudeResponse ? game.claudeResponse.split('\n')[0] : "Game preview and analysis not available."}
      </p>
      <div className="text-center">
        <Link href={`/game/${game.gameId}`} className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors">
          View Game Details
        </Link>
      </div>
    </article>
  );
};

export default GameCard;