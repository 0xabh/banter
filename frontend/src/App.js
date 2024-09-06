import { ethers } from 'ethers';
import './App.css';
import { baseTokenContractAddress, getMainContract, getMainContractRead, getTokenAMMContract, getTokenContract, getWeb3Provider, requestAccounts, switchNetwork } from './Web3/web3';

function App() {
  const connectWallet = async () => {
    if (!window.ethereum) {
      window.location.href = "https://metamask.io/download/";
      return;
    }
    try {
      await switchNetwork();
      const provider = getWeb3Provider();
      const address = await requestAccounts(provider);
      console.log(address);
    } catch (error) {
      alert(error);
    }
  };
  const mintBaseToken=async()=>{
    const provider=getWeb3Provider();
    const contract=getTokenContract(provider,baseTokenContractAddress);
    console.log(contract);
    const tx=await contract.mint("0x7783Eb57994CA3D2d94c56bdb7b4511e259Ab1b0",10000000);
    await tx.wait();
  }
  const setNewOwner=async()=>{
    const provider=getWeb3Provider();
    const contract=getTokenAMMContract(provider);
    const tx=await contract.setNewOwner("0x7783Eb57994CA3D2d94c56bdb7b4511e259Ab1b0");
    await tx.wait();
  }


  const addPLayer=async()=>{
    const provider=getWeb3Provider();
    const signer = provider.getSigner();
    const contractRead=getMainContractRead(provider);
    const contract=contractRead.connect(signer);
    contractRead.on("PlayerAdded",(tokenAddress, name, position,team,price) => {
      console.log(tokenAddress);
      console.log(name);
    });
    console.log(contract);
    const tx=await contract.addPlayer("Ronaldo","RON",1,1,2,10000,1000,{gasLimit:3000000});
    await tx.wait();
  }
  



  return (
    <div className="App">
      <button onClick={connectWallet}>Connect</button>
      <button onClick={mintBaseToken}>Mint</button>
      <button onClick={setNewOwner}>Set</button>
      <button onClick={addPLayer}>Add</button>
    </div>
  );
}

export default App;
