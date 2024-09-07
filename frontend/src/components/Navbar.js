import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Img/trophy.png";
import { Button, Navbar } from "flowbite-react";
import { getWeb3Provider, requestAccounts, switchNetwork } from "../Web3/web3";
const NavbarComponent = () => {
  const [display, setDisplay] = useState(null);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const truncateWalletAddress = async (address, length = 4) => {
    if (!address) return "";
    const start = address.substring(0, length);
    const end = address.substring(address.length - length);
    setDisplay(`${start}...${end}`);
  };
  const connectWallet = async () => {
    if (!window.ethereum) {
      window.location.href = "https://metamask.io/download/";
      return;
    }
    try {
      await switchNetwork();
      const provider = getWeb3Provider();
      const address = await requestAccounts(provider);
      setAccount(truncateWalletAddress(address));
      console.log(address);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <Navbar fluid rounded className="bg-white shadow-lg text-black">
      <Navbar.Brand
        onClick={() => navigate("/")}
        className="ml-20 cursor-pointer -mr-16"
      >
        <img
          src={logo}
          className="ml-20"
          alt="Flowbite React Logo"
          style={{
            height: "25px",
            marginTop: "-50px",
            marginBottom: "-55px",
            marginLeft: "50px",
            marginRight: "10px",
          }}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-black">
          Banter Fantasy League
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 mr-40">
        {!account ? (
          <Button color="dark" onClick={connectWallet}>
            Connect Wallet
          </Button>
        ) : (
          <Button color="dark" onClick={connectWallet}>
            {display}
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="-ml-20">
        <Link to="/players">Players</Link>
        <Link to="/leagues">Leagues</Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
