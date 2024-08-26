import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import abiData from "./SimpleCoinFlip.json"; // Assuming the ABI is in this file
import "./App.css";

const CONTRACT_ADDRESS = "0x577D8d699100e16d3C3D8f44071aEc0527a26bd4"; // Replace with your deployed contract address

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [flipResult, setFlipResult] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3Modal = new Web3Modal({
          network: "sepolia", // Replace with your network (e.g., sepolia, mainnet)
          cacheProvider: true,
        });

        const instance = await web3Modal.connect();
        const newProvider = new ethers.providers.Web3Provider(instance);
        const signer = newProvider.getSigner();

        const accounts = await newProvider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

        const contract = new ethers.Contract(CONTRACT_ADDRESS, abiData.abi, signer);

        setProvider(newProvider);
        setSigner(signer);
        setContract(contract);
        
      } catch (error) {
        console.error("Error initializing web3modal:", error);
      }
    };

    init();
  }, []);

  const getContractBalance = async () => {
    if (!contract) {
      console.error("Contract is not loaded");
      return;
    }
  
    try {
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      console.log(`Contract Balance: ${ethers.utils.formatEther(balance)} ETH`);
    } catch (error) {
      console.error("Error fetching contract balance:", error);
    }
  };
  

  const handleFlip = async (side) => {
    if (!contract) {
        console.error("Contract is not loaded");
        return;
    }

    try {
        // Ensure betAmount is valid
        if (isNaN(betAmount) || parseFloat(betAmount) <= 0.0001) {
            alert("Please enter a valid bet amount");
            return;
        }

        const tx = await contract.flip(side, { value: ethers.utils.parseEther(betAmount) });
        const receipt = await tx.wait(); // Wait for the transaction to be mined

        // Check if the receipt contains events and find the specific "CoinFlipped" event
        const event = receipt.events?.find(event => event.event === "CoinFlipped");

        if (event) {
            const { outcome } = event.args;
            if (outcome) {
                alert("You won the flip!");
            } else {
                alert("You lost the flip!");
            }
            setFlipResult(outcome ? "Win" : "Lose");
        } else {
            console.error("CoinFlipped event not found in transaction receipt");
        }
    } catch (error) {
        console.error("Transaction failed:", error);
    }
};

  

  return (
    <div className="App">
      <h1>Coin Flip Game</h1>
      <p>Connected account: {account}</p>
      <input
        type="text"
        placeholder="Bet amount in ETH"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
      /><br/><br/>
      <button onClick={getContractBalance}>balance</button>
      <button onClick={() => handleFlip(true)}>Heads</button>
      <button onClick={() => handleFlip(false)}>Tails</button>
      {flipResult && <p>Result: You {flipResult}!</p>}
    </div>
  );
}

export default App;
