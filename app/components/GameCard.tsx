import React from 'react';
import { Game } from '../types';
interface GameCardProps {
  game: Game;
  awayTeamName: string;
  homeTeamName: string;
}

const GameCard: React.FC<GameCardProps> = ({ game, awayTeamName, homeTeamName }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mr-[25px]">
      <h3 className="text-lg font-semibold text-blue-600">{awayTeamName} @ {homeTeamName}</h3>
      <p className="text-gray-600">Start Time: {game.time}</p>
      <p className="text-gray-600">Pitchers: {game.awayStartingPitcher.name} vs {game.homeStartingPitcher.name}</p>
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">
        View Premium Pick
      </button>
    </div>
  );
};

export default GameCard;