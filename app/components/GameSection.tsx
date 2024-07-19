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
              This is today's featured matchup. Our analysis suggests a strong opportunity for value betting. 
              Key factors include recent team performance, pitcher matchups, and historical data.
            </p>
            <div className="mb-4 p-4 bg-gray-100 rounded-md">
              <p className="font-semibold text-gray-800">Moneyline: Baltimore (-120)</p>
              <p className="font-semibold text-gray-800">Over/Under: Over 8.5 (-110)</p>
            </div>
            <button 
              onClick={toggleDetailedAnalysis}
              className="inline-block px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors"
            >
              {showDetailedAnalysis ? "Hide Detailed Analysis" : "View Detailed Analysis"}
            </button>
            {showDetailedAnalysis && (
              <div className="mt-4 text-gray-700">
                <p className="mb-2">
                  In today's matchup between the Baltimore Orioles and the New York Yankees, we're seeing a compelling opportunity for value betting. The Orioles, despite being slight underdogs, have shown remarkable consistency in their recent performances, particularly in their offensive output.
                </p>
                <p className="mb-2">
                  The pitching matchup is particularly intriguing. Baltimore's starter has been in excellent form, maintaining a sub-3.00 ERA over his last five starts. In contrast, the Yankees' pitcher, while talented, has shown some vulnerability against left-handed hitters - a strength in the Orioles' lineup.
                </p>
                <p className="mb-2">
                  Historical data also favors the Orioles in this matchup. They've won 7 of their last 10 games against the Yankees when playing as underdogs, suggesting they often outperform expectations in this rivalry. Moreover, the over has hit in 6 of the last 8 meetings between these teams at Yankee Stadium.
                </p>
                <p>
                  Given these factors, we see value in both the Orioles on the moneyline and the over on the total. The combination of Baltimore's recent form, the favorable pitching matchup, and historical trends make this an attractive betting opportunity.
                </p>
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
