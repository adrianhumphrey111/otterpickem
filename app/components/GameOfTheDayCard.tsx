import React, { useState } from 'react';
import Image from 'next/image';
import { Game } from '../types';

interface GameOfTheDayCardProps {
  game: Game;
}

const GameOfTheDayCard: React.FC<GameOfTheDayCardProps> = ({ game }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const awayTeamName = game.awayTeam.name;
  const homeTeamName = game.homeTeam.name;

  return (
    <article className="w-full max-w-md mx-auto mb-4 p-4 bg-white rounded-lg shadow-md border border-blue-300">
      <div className="text-center mb-2">
        <span className="text-lg font-bold text-blue-600">Game of the Day</span>
      </div>
      <div className="grid grid-cols-3 gap-2 items-center mb-2">
        <div className="flex flex-col items-center">
          <Image src={game.awayTeam.logoUrl} alt={`${awayTeamName} logo`} width={60} height={60} className="mb-1" />
          <h2 className="text-sm font-bold text-gray-900 text-center truncate w-full">{awayTeamName}</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-xl font-bold">@</span>
          <span className="text-sm text-gray-500">{game.time}</span>
        </div>
        <div className="flex flex-col items-center">
          <Image src={game.homeTeam.logoUrl} alt={`${homeTeamName} logo`} width={60} height={60} className="mb-1" />
          <h2 className="text-sm font-bold text-gray-900 text-center truncate w-full">{homeTeamName}</h2>
        </div>
      </div>
      <div className="text-sm text-gray-600 text-center mb-2">
        {game.awayStartingPitcher.name} vs {game.homeStartingPitcher.name}
      </div>
      <div className="mb-3">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          {showAnalysis ? 'Hide Detailed Info' : 'View Detailed Info'}
        </button>
      </div>
      {showAnalysis && (
        <div className="text-sm text-gray-700 mt-3">
          {game.completeAnalysis ? (
            game.completeAnalysis.split("\\n").map((paragraph, index) => (
              index === 0 ? (
                <h3 key={index} className="text-lg font-bold mb-2">{paragraph}</h3>
              ) : (
                <p key={index} className="mb-2">{paragraph}</p>
              )
            ))
          ) : (
            "Detailed analysis not available yet."
          )}
        </div>
      )}
    </article>
  );
};

export default GameOfTheDayCard;
