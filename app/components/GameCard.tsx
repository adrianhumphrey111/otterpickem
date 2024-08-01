import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <div className="grid grid-cols-3 gap-2 items-center mb-2">
        <div className="flex flex-col items-center">
          {/* <Image src={`/team-logos/${gameData.awayTeam.abbr.toLowerCase()}.png`} alt={`${awayTeamName} logo`} width={40} height={40} className="mb-1" /> */}
          <h2 className="text-sm font-bold text-gray-900 text-center truncate w-full">{awayTeamName}</h2>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-lg font-bold">@</span>
          <span className="text-xs text-gray-500">
            {gameData.scheduled ? new Date(gameData.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          {/* <Image src={`/team-logos/${gameData.homeTeam.abbr.toLowerCase()}.png`} alt={`${homeTeamName} logo`} width={40} height={40} className="mb-1" /> */}
          <h2 className="text-sm font-bold text-gray-900 text-center truncate w-full">{homeTeamName}</h2>
        </div>
      </div>
      <div className="text-xs text-gray-500 text-center mb-2">
        {gameData.boxScore?.away?.probable_pitcher?.full_name || 'TBA'} vs {gameData.boxScore?.home?.probable_pitcher?.full_name || 'TBA'}
      </div>
      <p className="text-xs text-gray-700 mb-3 h-16 overflow-hidden">
        {game.claudeResponse ? game.claudeResponse.split('\n')[0] : "Game preview and analysis not available."}
      </p>
      <div className="text-center">
        <Link href="/signup" className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-green-700 transition-colors">
          View Premium Pick
        </Link>
      </div>
    </article>
  );
};

export default GameCard;
