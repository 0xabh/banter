import { ethers, providers } from "ethers";
import abi from "../abis/PlayerToken.json";
import abi1 from "../abis/PlayerTokenAMM.json";
import abi2 from "../abis/BanterFantasySports.json";


export const baseTokenContractAddress = "0xDee3F1Ad0E5A2aAfDFC966fD574FD88E40F2f658";
export const TokenAMMContractAddress="0x9D6d157b309c161a5395E04FFBd903155642Df3E";
export const MainContractAddress=" 0x7783Eb57994CA3D2d94c56bdb7b4511e259Ab1b0";
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

export const getTokenAMMContract = (provider, address) => {
  const contractABI = abi1.abi;
  return new ethers.Contract(address, contractABI, provider);
};

export const getMainContract = (provider, address) => {
  const contractABI = abi2.abi;
  return new ethers.Contract(address, contractABI, provider);
};

export const getMainContractRead = (provider, address) => {
    const contractABI = abi2.abi;
    return new ethers.Contract(address, contractABI, provider);
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

