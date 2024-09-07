import { Routes, Route } from "react-router-dom";
import Players from "../components/Players";
import Home from "../components/Home";
import JoinLeague from "../components/JoinLeagues";
import League from "../components/League";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/players" element={<Players />} />
      <Route path="/leagues" element={<JoinLeague />} />
      <Route path="/leagues/leagueId:/:leagueId" element={<League />} />
    </Routes>
  );
};
export default Router;
