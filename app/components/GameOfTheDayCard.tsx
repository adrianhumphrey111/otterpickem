import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Game } from '../types';

interface GameOfTheDayCardProps {
  game: Game;
}

const GameOfTheDayCard: React.FC<GameOfTheDayCardProps> = ({ game }) => {
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
      <p className="text-sm text-gray-700 mb-3 h-20 overflow-hidden">
        {game.completeAnalysis || "Game analysis not available yet."}
      </p>
      <div className="text-center">
        <Link href="/signup" className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
          View Premium Pick
        </Link>
      </div>
    </article>
  );
};

export default GameOfTheDayCard;
