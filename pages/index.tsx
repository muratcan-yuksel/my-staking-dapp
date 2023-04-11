import React, { useState, useEffect } from "react";
import { WHITELIST_CONTRACT_ADDRESS, abi } from "./constants/";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
    //
  }
}

const Home = () => {
  const connectWallet = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed so are
      // only have read-only access
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider("localhost");
    } else {
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return <div></div>;
};

export default Home;
