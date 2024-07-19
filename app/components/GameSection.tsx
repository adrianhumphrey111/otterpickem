'use client';

import { useState, useEffect } from "react";
import GamesList from "./GameList";
import { Game } from "../types";

export default function GameSection() {
  const [games, setGames] = useState<Game[]>([]);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/mlb/getTodaysCompletedGameAnalysis');
        const data = await response.json();
        console.log('Fetched games:', data); // Add this line for debugging
        setGames(data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    }

    fetchGames();
  }, []);
 
  const gameOfTheDay = games.find(game => game.gameOfTheDay);
  console.log({ games });

  const toggleDetailedAnalysis = () => {
    setShowDetailedAnalysis(!showDetailedAnalysis);
  };

  if (gameOfTheDay){
    console.log(gameOfTheDay.completeAnalysis?.split("\\n"))
  }
  return (
    <>
      {gameOfTheDay && (
        <section id="free-pick" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">{`Today's Free Pick`}</h2>
          <article className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{`${gameOfTheDay.awayTeam.name} @ ${gameOfTheDay.homeTeam.name}`}</h3>
            <div className="text-gray-500 text-sm mb-4">
              <span>{gameOfTheDay.time}</span>
              <span className="mx-2">·</span>
              <span>{`${gameOfTheDay.awayStartingPitcher.name} vs ${gameOfTheDay.homeStartingPitcher.name}`}</span>
            </div>
            <p className="text-gray-700 mb-4">
              {`This is today's featured matchup. Our analysis suggests a strong opportunity for value betting. 
              Key factors include recent team performance, pitcher matchups, and historical data.`}
            </p>
            <div className="mb-4 p-4 bg-gray-100 rounded-md">
              <p className="font-semibold text-gray-800">{`Moneyline: ${gameOfTheDay.moneyLine}`}</p>
              <p className="font-semibold text-gray-800">{`Over/Under: ${gameOfTheDay.overUnder}`}</p>
            </div>
            <button 
              onClick={toggleDetailedAnalysis}
              className="inline-block px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors"
            >
              {showDetailedAnalysis ? "Hide Detailed Analysis" : "View Detailed Analysis"}
            </button>
            {showDetailedAnalysis && (
              <div className="mt-4 text-gray-700">
                {gameOfTheDay.completeAnalysis?.split("\\n").map((paragraph, index) => (
                  index === 0 ? (
                    <h3 key={index} className="text-xl font-bold mb-4">
                      {paragraph.trim()}
                    </h3>
                  ) : (
                    <p key={index} className="mb-4">
                      {paragraph.trim()}
                    </p>
                  )
                ))}
              </div>
            )}
          </article>
        </section>
      )}

      <section id="all-games" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-blue-400">All Games</h2>
        <GamesList games={games} />
      </section>
    </>
  );
}
