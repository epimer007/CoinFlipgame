/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
    networks: {
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/qtAL581Wqrg9EqeevU1hyj8YfOWAvjLw", // or use Alchemy or another provider
            accounts: ["72ad16e4842ae8c408126bad19c1eb7dc5c24d5f81dsg4636dfh"]
        },
    },
};
