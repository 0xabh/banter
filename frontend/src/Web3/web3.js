import { ethers } from "ethers";
import abi from "../abis/PlayerToken.json";
import abi1 from "../abis/PlayerTokenAMM.json";
import abi2 from "../abis/BanterFantasySports.json";

export const baseTokenContractAddress =
  "0xDee3F1Ad0E5A2aAfDFC966fD574FD88E40F2f658";
export const TokenAMMContractAddress =
  "0x9D6d157b309c161a5395E04FFBd903155642Df3E";
export const MainContractAddress = "0x7783Eb57994CA3D2d94c56bdb7b4511e259Ab1b0";

export const players = [
  {
    name: "Ronaldo",
    address: "0x3cC3E4C3BF64A133Df02B24541AE3ea664175573",
    Price: "2 Token",
    Team: "Portugal",
    Image:
      "https://media.gettyimages.com/id/1325105287/photo/budapest-hungary-cristiano-ronaldo-of-portugal-celebrates-after-scoring-their-sides-first.jpg?s=612x612&w=0&k=20&c=JkexJMMNLeQgvM1be_BhmM3WWuj6xkwrosRkSwZsToo=",
  },
  {
    name: "Messi",
    address: "0x7a9B1F7818dDD00bBc2ab10eb584269851CfEe59",
    Price: "3 Token",
    Team: "Argentina",
    Image:
      "https://media.gettyimages.com/id/1449019297/photo/lusail-city-qatar-lionel-messi-of-argentina-celebrates-the-teams-3-0-victory-in-the-fifa.jpg?s=612x612&w=0&k=20&c=wODGcoobGSuaY0qVPdUuObqAjj3BDe57DrMtDR4i_tU=",
  },
  {
    name: "Neymar",
    address: "0x7a9B1F7818dDD00bBc2ab10eb584269851CfEe59",
    Price: "3 Token",
    Team: "Brazil",
    Image:
      "https://media.gettyimages.com/id/1239479538/photo/brazils-neymar-celebrates-after-scoring-against-chile-during-their-south-american.jpg?s=612x612&w=0&k=20&c=ufolQgSCVAmct-wQwKqYhMo_hEnge547guvQE8ZasLU=",
  },
  {
    name: "Mbappe",
    address: "0x7a9B1F7818dDD00bBc2ab10eb584269851CfEe59",
    Price: "3 Token",
    Team: "France",
    Image:
      "https://media.gettyimages.com/id/1495838361/photo/paris-france-kylian-mbappe-of-paris-saint-germain-in-action-during-the-ligue-1-match-between.jpg?s=612x612&w=0&k=20&c=2c9LAuW-AhVX41lx9gHYsfeaZFZKSnswSOxgODu3yL8=",
  },
  {
    name: "Zlatan",
    address: "0x7a9B1F7818dDD00bBc2ab10eb584269851CfEe59",
    Price: "3 Token",
    Team: "Sweden",
    Image:
      "https://media.gettyimages.com/id/1474402333/photo/udine-italy-zlatan-ibrahimovic-of-ac-milan-celebrates-after-scoring-the-teams-first-goal-from.jpg?s=612x612&w=0&k=20&c=kLev4LbKU0S2bUOwO58K3u5K42hgVTAE1VjPXIIhCRU=",
  },
];

export const Leagues = [
  {
    name: "LALIGA",
    title:"The top league in Spain",
    LeagueId: "1",
  },
  {
    name: "Bundesliga",
    title:"The top league in Germany",
    LeagueId: "2",
  },
];
export function getWeb3Provider() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider;
}
export async function getChainId() {
  const chainId = await window.ethereum.request({
    method: "eth_chainId",
    params: [],
  });
  return chainId;
}
export async function requestAccounts(provider) {
  const accounts = await provider.send("eth_requestAccounts", []);
  return accounts[0];
}

export const getTokenContract = (provider, address) => {
  const contractABI = abi.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(address, contractABI, signer);
};

export const getTokenAMMContract = (provider) => {
  const contractABI = abi1.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(TokenAMMContractAddress, contractABI, signer);
};

export const getMainContract = (provider) => {
  const contractABI = abi2.abi;
  const signer = provider.getSigner();
  return new ethers.Contract(MainContractAddress, contractABI, signer);
};

export const getMainContractRead = (provider) => {
  const contractABI = abi2.abi;
  return new ethers.Contract(MainContractAddress, contractABI, provider);
};

export const addNetwork = async () => {
  const chainId = `0x${Number(88882).toString(16)}`;
  const rpcUrl = "https://chiliz-spicy.publicnode.com/";
  const chainName = "Chiliz Spicy Testnet";
  const blockUrl = "https://testnet.chiliscan.com/";
  const networkParams = {
    chainId: chainId,
    chainName: chainName, // Network name
    nativeCurrency: {
      name: "Chiliz",
      symbol: "CHZ",
      decimals: 18,
    },
    rpcUrls: [rpcUrl],
    blockExplorerUrls: [blockUrl], // Block explorer URL
  };
  window.ethereum
    .request({
      method: "wallet_addEthereumChain",
      params: [networkParams],
    })
    .then(() => {
      console.log("Custom network added to MetaMask");
    })
    .catch((error) => {
      console.error("Failed to add custom network to MetaMask:", error);
    });
};
export async function switchNetwork() {
  await window.ethereum
    .request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(88882).toString(16)}` }],
    })
    .then(() => {
      console.log("Chain ID is added in MetaMask");
    })
    .catch((error) => {
      if (error.code === 4902) {
        console.log("Chain ID is not added in MetaMask");
        addNetwork();
      } else {
        console.error(error);
      }
    });
}
