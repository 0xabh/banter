import { Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateTeam from "./CreateTeam";
import LeaderBoard from "./LeaderBoard";
import MarketPlace from "./MarketPlace";
import { getDecimal, getMainContractRead, getWeb3Provider } from "../Web3/web3";
import BeatLoader from "react-spinners/BeatLoader";
export default function League() {
  const { leagueId } = useParams();
  const [selectedTab, setSelectedTab] = useState("createTeam");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [value, setValue] = useState("");
  const override = {
    display: "block",
    marginTop: "250px",
  };
  console.log(leagueId);
  const provider = getWeb3Provider();
  const contract = getMainContractRead(provider);
  const signer = provider.getSigner();
  useEffect(() => {
    async function getLeagueInfo() {
      const tx = await contract.leagues(leagueId);
      const address = await signer.getAddress();
      const balance = await contract.leagueTeams(leagueId, address);
      const alloted = balance.allotedBalance;
      const number = getDecimal(alloted, 4);
      setValue(number);
      setLeagueName(tx.description);
      setLoading(false);
    }
    getLeagueInfo();
  }, [status]);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center">
          <BeatLoader color="black" cssOverride={override} />
        </div>
      ) : (
        <div>
          <h1 className="flex justify-center mt-10 font-bold text-2xl">
            {leagueName}
          </h1>
          <h1 className="flex justify-center mt-2 font-bold text-xl">
            Left Balance: {value} Tokens
          </h1>
          <div className="flex justify-center mt-2">
            <Button.Group>
              <Button color="gray" onClick={() => setSelectedTab("createTeam")}>
                Create Team
              </Button>
              <Button
                color="gray"
                onClick={() => setSelectedTab("marketplace")}
              >
                MarketPlace
              </Button>
              <Button
                color="gray"
                onClick={() => setSelectedTab("leaderBoard")}
              >
                LeaderBoard
              </Button>
            </Button.Group>
          </div>
          {selectedTab === "createTeam" && <CreateTeam setStatus={setStatus} />}
          {selectedTab === "marketplace" && <MarketPlace />}
          {selectedTab === "leaderBoard" && <LeaderBoard />}
        </div>
      )}
    </div>
  );
}
