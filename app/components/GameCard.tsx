// components/GameCard.tsx
import React from 'react';

interface GameCardProps {
  awayTeam: string;
  homeTeam: string;
  time: string;
  awayPitcher: string;
  homePitcher: string;
}

const GameCard: React.FC<GameCardProps> = ({ awayTeam, homeTeam, time, awayPitcher, homePitcher }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-blue-600">{awayTeam} @ {homeTeam}</h3>
      <p className="text-gray-600">Start Time: {time}</p>
      <p className="text-gray-600">Pitchers: {awayPitcher} vs {homePitcher}</p>
      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors">
        View Premium Pick
      </button>
    </div>
  );
};

export default GameCard;