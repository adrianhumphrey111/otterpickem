// components/GamesList.tsx
import React from 'react';
import Slider from 'react-slick';
import GameCard from './GameCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GamesListProps } from '../types';

const GamesList: React.FC<GamesListProps> = ({ games }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0, // Ensure the slider starts at the first slide
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {games.map(game => (
          <GameCard
            key={game.id}
            game={game}
            awayTeamName={game.awayTeam.name}
            homeTeamName={game.homeTeam.name}
          />
        ))}
      </Slider>
    </div>
  );
};

export default GamesList;