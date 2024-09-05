require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
module.exports = {
  solidity: "0.8.24",
  networks: {
    Chiliz: {
      url: "https://chiliz-spicy.publicnode.com/",
      accounts: [PRIVATE_KEY],
    },
  },
};
