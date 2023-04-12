import React, { useState, useEffect } from "react";
import { WHITELIST_CONTRACT_ADDRESS } from "./constants/";
import { ethers } from "ethers";
import stakerAbi from "../contracts/artifacts/contracts/Staker.sol/Staker.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Home = () => {
  const abi = stakerAbi.abi;
  const [walletConnected, setWalletConnected] = useState(false);
  const [deadline, setDeadline] = useState(0);
  const [threshold, setThreshold] = useState<string>("0");
  const [staked, setStaked] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const connectWallet = async () => {
    try {
      let signer = null;

      let provider;
      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        provider = ethers.getDefaultProvider("localhost");
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);

        signer = await provider.getSigner();
      }
      getThreshold();
    } catch (error) {
      console.log("error", error);
    }
  };

  const getThreshold = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      provider
    );
    const threshold = await contract.threshold();
    console.log("threshold", ethers.formatEther(threshold));
    let formattedThreshold = ethers.formatEther(threshold);
    setThreshold(formattedThreshold);
    console.log(threshold);
  };

  const stake = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    const tx = await contract.stake({
      value: ethers.parseEther("0.3"),
    });
    console.log("tx", tx);
  };

  const getUserBalance = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    const balance = await contract.userBalance();
    console.log("balance", balance);
    setUserBalance(balance);
  };

  useEffect(() => {
    // connectWallet();
  }, []);

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div className="flex">
        <h2>Need {threshold && threshold} </h2>
        <h2>/</h2>
        <h2>Staked {staked} </h2>
      </div>
    </div>
  );
};

export default Home;
