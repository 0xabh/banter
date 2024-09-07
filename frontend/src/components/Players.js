import { Card } from "flowbite-react";
import React from "react";
import { players } from "../Web3/web3";
import logo from "../Img/trophy.png";
const PlayerCard = ({ player }) => {
  return (
    <Card className="max-w-xs" imgSrc={`${player.Image}`}>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {player.name}
      </h5>
      <div className="flex flex-row -mt-2">
        <img
          src={logo}
          className="mr-1"
          alt="Flowbite React Logo"
          style={{
            height: "18px",
          }}
        />
        <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
          {player.Team}
        </p>
      </div>
      <p className="font-normal text-gray-900 -mt-2">Price: {player.Price}</p>
    </Card>
  );
};

export default function Players() {
  return (
    <div
      className="flex flex-wrap gap-10 mt-10"
      style={{ marginLeft: "200px" }}
    >
      {players.map((player, index) => (
        <div key={index} className="w-full sm:w-1/2 lg:w-1/5 mb-6">
          <PlayerCard player={player} />
        </div>
      ))}
    </div>
  );
}
