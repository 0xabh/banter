import { Button, Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  getMainContract,
  getTokenAMMContractRead,
  getWeb3Provider,
  players,
} from "../Web3/web3";
import logo from "../Img/trophy.png";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
const PlayerCard = ({ player }) => {
  const { leagueId } = useParams();
  const provider = getWeb3Provider();
  const contract = getMainContract(provider);
  async function buyPlayer(address) {
    const amount = ethers.utils.parseEther("0.5");
    try {
      const tx = await contract.buyPLayer(address, leagueId, { value: amount });
      await tx.wait();
    } catch (error) {
      console.log(error);
      toast.error(error.reason);
    }
  }
  async function sellPlayer(address) {
    const amount = ethers.utils.parseEther("0.5");
    try {
      const tx = await contract.sellPLayer(address, leagueId, {
        value: amount,
      });
      await tx.wait();
    } catch (error) {
      toast.error(error.reason);
    }
  }
  async function getPrice(address) {
    const AmmContract = getTokenAMMContractRead(provider);
    let ethValue;
    try {
      const tx = await AmmContract.getCurrentPlayerPrice(address);
      const decimalValue = ethers.BigNumber.from(tx);
      ethValue = ethers.utils.formatEther(decimalValue);
    } catch (error) {
      toast.error(error.reason);
    }
    return parseFloat(ethValue).toFixed(4);
  }
  const [prices, setPrices] = useState({});
  useEffect(() => {
    const fetchPrices = async () => {
      const priceMap = {};
      for (const player of players) {
        const price = await getPrice(player.address);
        priceMap[player.address] = price;
      }
      setPrices(priceMap);
    };
    fetchPrices();
  }, [players]);

  return (
    <Card className="max-w-xs">
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
        Price:{" "}
        {prices[player.address]
          ? `${prices[player.address]} Token`
          : "Loading..."}
      </p>
      <div className="mt-4 flex space-x-3 lg:mt-2">
        <Button onClick={() => sellPlayer(player.address)} color="dark">
          Sell
        </Button>
        <Button onClick={() => buyPlayer(player.address)} color="light">
          Buy
        </Button>
      </div>
    </Card>
  );
};

export default function MarketPlace() {
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
