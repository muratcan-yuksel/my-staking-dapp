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
  const [threshold, setThreshold] = useState<number>(0);
  const [staked, setStaked] = useState<number>(0);
  const [userBalance, setUserBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

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
      getTotalBalance();
      getUserBalance();
      setWalletConnected(true);
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
    setThreshold(Number(formattedThreshold));
    console.log(Number(formattedThreshold));
    incrementCount();
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
    // setStaked(Number(ethers.formatEther(tx.value)));
    incrementCount();
    getTotalBalance();
  };

  const getTotalBalance = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      provider
    );
    const balance = await contract.totalBalance();
    setStaked(Number(ethers.formatEther(balance)));
    console.log("balance", balance);
    incrementCount();
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
    setUserBalance(Number(ethers.formatEther(balance)));
    incrementCount();
  };

  const execute = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      WHITELIST_CONTRACT_ADDRESS,
      abi,
      signer
    );
    const tx = await contract.execute();
    console.log("tx", tx);
    const receipt = await tx.wait();
    console.log("receipt", receipt);
    incrementCount();
  };

  useEffect(() => {
    // connectWallet();
  }, [count]);

  return (
    <div className="h-screen bg-black text-white">
      <div className="flex justify-end">
        <button
          className="border border-spacing-4 border-pink-600 p-4 font-bold"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex">
          <h1 className="text-xl">Need {threshold && threshold} </h1>
          <h2 className="text-xl"> / </h2>
          <h1 className="text-xl">Staked {staked} </h1>
        </div>
        <button
          className="border border-spacing-4 border-pink-600 p-4 font-bold m-4"
          onClick={stake}
        >
          Stake
        </button>
        <br></br>
        <button
          className="border border-spacing-4 border-pink-600 p-4 font-bold m-4"
          onClick={getUserBalance}
        >
          Get User Balance
        </button>
        <h2>User Balance: {userBalance}</h2>
        <button
          className="border border-spacing-4 border-pink-600 p-4 font-bold m-4"
          onClick={execute}
        >
          {" "}
          Execute
        </button>
      </div>
    </div>
  );
};

export default Home;
