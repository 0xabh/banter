import { Button, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDecimal, getMainContractRead, getWeb3Provider } from "../Web3/web3";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";
export default function LeaderBoard() {
  const { leagueId } = useParams();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});
  const [gameWeek, setGameWeek] = useState(0);
  const [status, setStatus] = useState(false);
  const override = {
    display: "block",
    marginTop: "250px",
  };
  const provider = getWeb3Provider();
  const contract = getMainContractRead(provider);
  async function getUsers() {
    const users = await contract.getUsers(leagueId);
    return users;
  }
  async function getValues(address) {
    const tx = await contract.leagueTeams(leagueId, address);
    const noOfplayers = await contract.getUserPlayers(leagueId, address);
    const players = parseInt(noOfplayers._hex, 16);
    const Value = tx.totalValue;
    const winner = await contract.getTopUser(leagueId);
    const status = address === winner;
    const alloted = tx.allotedBalance;
    let number = getDecimal(alloted, 4);
    return { Value, number, status, players };
  }
  async function claimRewards() {
    const contractSign = contract.connect(provider.getSigner());
    contract.on("RewardsClaimed", (user) => {
      setStatus(true);
      toast.success("Reward Claimed Successfully");
    });
    try {
      const tx = await contractSign.claimRewards(leagueId, {
        gasLimit: 3000000,
      });
      await tx.wait();
    } catch (err) {
      console.log(err);
      toast.error(err.reason);
    }
  }
  useEffect(() => {
    const fetchValues = async () => {
      setLoading(true);
      const users = [];
      const leagueUsers = await getUsers();
      for (const user of leagueUsers) {
        const { Value, number, status, players } = await getValues(user);
        let totalValue = getDecimal(Value, 4);
        const existingUser = users.find((item) => item.user === user);
        if (!existingUser) {
          users.push({ user, totalValue, number, status, players });
        }
      }
      users.sort((a, b) => b.totalValue - a.totalValue);
      const tx = await contract.leagues(leagueId);
      const gameWeek = tx.gameWeek;
      console.log(gameWeek);
      const number = parseInt(gameWeek._hex, 16);
      console.log(number);
      setGameWeek(number);
      setUsers([...new Set(users)]);
      setLoading(false);
    };
    fetchValues();
  }, [status]);
  return (
    <div>
      <h1 className="flex justify-center text-3xl font-bold mt-1">
        GameWeek: {gameWeek}
      </h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <BeatLoader color="black" cssOverride={override} />
        </div>
      ) : (
        <div className="flex justify-center mt-7">
          <div className="overflow-x-auto w-3/4">
            <Table hoverable striped>
              <Table.Head>
                <Table.HeadCell>Number</Table.HeadCell>
                <Table.HeadCell>User Address</Table.HeadCell>
                <Table.HeadCell>Total Value</Table.HeadCell>
                <Table.HeadCell>Total Players</Table.HeadCell>
                <Table.HeadCell>
                  <span className="sr-only">Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {users.map((item, key) => (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {key + 1}
                    </Table.Cell>
                    <Table.Cell>{item.user}</Table.Cell>
                    <Table.Cell>{item.totalValue}</Table.Cell>
                    <Table.Cell>{item.players}</Table.Cell>
                    <Table.Cell>
                      {item.status == true ? (
                        <Button color="dark" onClick={claimRewards}>
                          Claim rewards
                        </Button>
                      ) : (
                        ""
                      )}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
