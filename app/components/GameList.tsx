// components/GamesList.tsx
import React from 'react';
import Slider from 'react-slick';
import GameCard from './GameCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Game {
  awayTeam: string;
  homeTeam: string;
  time: string;
  awayPitcher: string;
  homePitcher: string;
}

interface GamesListProps {
  games: Game[];
}

const GamesList: React.FC<GamesListProps> = ({ games }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Slider {...settings}>
      {games?.map((game, index) => (
        <div key={index} className="px-2">
          <GameCard {...game} />
        </div>
      ))}
    </Slider>
  );
};

export default GamesList;