import { Button, Card } from "flowbite-react";
import React from "react";
import { Leagues } from "../Web3/web3";
import logo from "../Img/trophy.png";
import { useNavigate } from "react-router-dom";
const LeagueCard = ({ league }) => {
  const navigate = useNavigate();
  return (
    <Card className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {league.name}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400 -mt-2">
        {league.title}
      </p>
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
          {league.LeagueId}
        </p>
      </div>
      <Button
        color="dark"
        onClick={() => navigate(`/leagues/leagueId:/${league.LeagueId}`)}
      >
        Join League
        <svg
          className="-mr-1 ml-2 h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Button>
    </Card>
  );
};

export default function JoinLeague() {
  return (
    <div
      className="flex flex-wrap gap-10 mt-20"
      style={{ marginLeft: "200px" }}
    >
      {Leagues.map((league, index) => (
        <div key={index} className="w-full sm:w-1/2 lg:w-1/5 mb-6">
          <LeagueCard league={league} />
        </div>
      ))}
    </div>
  );
}
