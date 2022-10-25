// @ts-nocheck

import { convertLBC } from "shared/utils";
import Web3 from "web3";

import LubyGame from "contracts/LubyGame.json";

declare let window: any;

let selectedAccount;
let contract;
let isInitialized = false;
let addressContract = "";

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected accounts: ${selectedAccount}`);
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    provider.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected accounts: ${selectedAccount}`);
    });
  } else {
    alert("Please install MetaMask!");
  }
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  console.log({ networkId });
  // @ts-ignore
  contract = new web3.eth.Contract(
    LubyGame.abi,
    LubyGame.networks[networkId].address
  );
  addressContract = LubyGame.networks[networkId].address;
  isInitialized = true;
};

const addTokenToWallet = async (address, symbol, decimals, tokenImage) => {
  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: address,
          symbol: symbol,
          decimals: decimals,
          image: tokenImage,
        },
      },
    });
    if (wasAdded) {
      console.log("Thanks for your interest!");
    } else {
      console.log("Your loss!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const approve = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await contract.methods
    .approve(convertLBC(10))
    .send({ from: selectedAccount });
  return total;
};

export const getOwnerBalance = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await contract.methods
    .getBalance(selectedAccount)
    .call({ from: selectedAccount });
  return total;
};

export const getPlayerBalance = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await contract.methods
    .getBalanceIndividual()
    .call({ from: selectedAccount });
  return total;
};

export const getBalanceOf = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await contract.methods.balanceOf(selectedAccount).call();
  return total;
};

export const mint = async () => {
  if (!isInitialized) {
    await init();
  }

  try {
    const resultMint = await contract.methods
      .mintLbc(convertLBC(10))
      .send({ from: selectedAccount });

    return resultMint;
  } catch (err) {
    return err;
  }
};
