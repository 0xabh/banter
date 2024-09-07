import React, { useState } from "react";
import { getMainContract, getWeb3Provider, players } from "../Web3/web3";
import { ethers } from "ethers";
import { Button, Card, Checkbox, Label } from "flowbite-react";
import logo from "../Img/trophy.png";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function CreateTeam() {
  const [playersAdded, setPlayersAdded] = useState([]);
  console.log(playersAdded);
  const { leagueId } = useParams();
  const createTeam = async () => {
    if (playersAdded.length < 2) {
      toast.error("You need to add at least 2 players");
      return;
    }
    const provider = getWeb3Provider();
    const contract = getMainContract(provider);
    console.log(contract);
    const amount = ethers.utils.parseEther("10");
    try {
      const tx = await contract.createTeam(playersAdded, leagueId, {
        value: amount,
      });
      await tx.wait();
    } catch (error) {
      toast.error("Transaction failed");
    }
  };
  const handleCheckboxChange = (event, address) => {
    if (event.target.checked) {
      setPlayersAdded((prevPlayers) => [...prevPlayers, address]);
    } else {
      setPlayersAdded((prevPlayers) =>
        prevPlayers.filter((player) => player !== address)
      );
    }
  };
  return (
    <div>
      <div
        className="flex flex-row gap-3 mt-10"
        style={{ marginLeft: "200px" }}
      >
        {players.map((player, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/3 mb-6 cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
          >
            <Card className="max-w-60" imgSrc={`${player.Image}`}>
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
              <p className="font-normal text-gray-900 -mt-2">
                Price: {player.Price}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onChange={(event) =>
                    handleCheckboxChange(event, player.address)
                  }
                />
                <Label htmlFor="accept" className="flex">
                  Add Player
                </Label>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Button onClick={createTeam} color="dark">
          Create Team
        </Button>
      </div>
    </div>
  );
}
