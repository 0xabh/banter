import { Button } from "flowbite-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CreateTeam from "./CreateTeam";
import LeaderBoard from "./LeaderBoard";
import MarketPlace from "./MarketPlace";

export default function League() {
  const { leagueId } = useParams();
  const [selectedTab, setSelectedTab] = useState("createTeam");
  console.log(leagueId);
  return (
    <div>
      <div className="flex justify-center mt-10">
        <Button.Group>
          <Button color="gray" onClick={() => setSelectedTab("createTeam")}>
            Create Team
          </Button>
          <Button color="gray" onClick={() => setSelectedTab("marketplace")}>
            MarketPlace
          </Button>
          <Button color="gray" onClick={() => setSelectedTab("leaderBoard")}>
            LeaderBoard
          </Button>
        </Button.Group>
      </div>
      {selectedTab === "createTeam" && <CreateTeam />}
      {selectedTab === "marketplace" && <MarketPlace />}
      {selectedTab === "leaderBoard" && <LeaderBoard />}
    </div>
  );
}
