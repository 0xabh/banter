import { Button, Card } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { players } from "../Web3/web3";
import logo from "../Img/trophy.png";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="ml-60 mt-20">
      <section className="bg-muted py-12 md:py-24">
        <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-2 items-center">
          {/* Left Section: Heading and Buttons */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Build Your Dream Team
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Buy, sell, and trade player tokens to create the ultimate fantasy
              football team and compete in on-chain leagues.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                size="lg"
                color="dark"
                onClick={() => navigate("/players")}
              >
                Explore Players
              </Button>
              <Button
                variant="outline"
                size="lg"
                color="light"
                onClick={() => navigate("/leagues")}
              >
                Join a League
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {players.slice(0, 3).map((player, index) => (
              <Card key={index} className="max-w-xs" imgSrc={player.Image}>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {player.name}
                </h5>
                <div className="flex flex-row -mt-2">
                  <img
                    src={logo}
                    className="mr-1"
                    alt="Team Logo"
                    style={{ height: "18px" }}
                  />
                  <p className="font-normal text-gray-700 dark:text-gray-400 mb-2">
                    {player.Team}
                  </p>
                </div>
                <p className="font-normal text-gray-900 -mt-2">
                  Price: {player.Price}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
