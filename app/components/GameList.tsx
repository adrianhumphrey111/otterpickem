import React from 'react';
import Slider from 'react-slick';
import GameCard from './GameCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { EvaluatedGame } from '../types';

interface GamesListProps {
  games: EvaluatedGame[];
}

const GamesList: React.FC<GamesListProps> = ({ games }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {games.map(game => (
          <div key={game.id} className="px-2">
            <GameCard game={game} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default GamesList;