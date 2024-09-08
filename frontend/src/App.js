import { ethers } from "ethers";
import "./App.css";
import {
  baseTokenContractAddress,
  getMainContract,
  getMainContractRead,
  getTokenAMMContract,
  getTokenContract,
  getWeb3Provider,
  MainContractAddress,
  requestAccounts,
  switchNetwork,
} from "./Web3/web3";
import NavbarComponent from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import Router from "./Routes/router";
function App() {
  const mintBaseToken = async () => {
    const provider = getWeb3Provider();
    const contract = getTokenContract(provider, baseTokenContractAddress);
    console.log(contract);
    const tx = await contract.mint(MainContractAddress, 10000000);
    await tx.wait();
  };
  const setNewOwner = async () => {
    const provider = getWeb3Provider();
    const contract = getTokenAMMContract(provider);
    const tx = await contract.setNewOwner(MainContractAddress);
    await tx.wait();
  };

  const addPLayer = async () => {
    const provider = getWeb3Provider();
    const signer = provider.getSigner();
    const contractRead = getMainContractRead(provider);
    const contract = contractRead.connect(signer);
    contractRead.on(
      "PlayerAdded",
      (tokenAddress, name, position, team, price) => {
        console.log(tokenAddress);
        console.log(name);
      }
    );
    console.log(contract);
    const tx = await contract.addPlayer("Zlatan", "ZL", 1, 1, 2, 10000, 1000, {
      gasLimit: ethers.utils.hexlify(3000000),
    });
    await tx.wait();
  };

  const createLeague = async () => {
    const provider = getWeb3Provider();
    const contract = getMainContract(provider);
    const block = await provider.getBlock("latest");
    const timestamp = block.timestamp + 30 * 60;
    const tx = await contract.createLeagues("Premier League", timestamp, {
      gasLimit: ethers.utils.hexlify(3000000),
    });
    await tx.wait();
  };

  return (
    <div className="App">
      <NavbarComponent />
      <Router />
    </div>
  );
}

export default App;
