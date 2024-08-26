// scripts/deploy.js
const { ethers } = require("hardhat");


async function main() {
    // Get the contract factory
    const CoinFlip = await ethers.getContractFactory("SimpleCoinFlip");

    console.log("Deploying the CoinFlip contract...");

    // Deploy the contract
    const coinFlip = await CoinFlip.deploy();
    await coinFlip.deployed();

    console.log("CoinFlip contract deployed to:", coinFlip.address);
}

// Run the script and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
