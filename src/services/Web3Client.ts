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

export const getGameBalance = async () => {
  if (!isInitialized) {
    await init();
  }
  const total = await contract.methods
    .getBalanceIndividual()
    .call({ from: selectedAccount });
  return total;
};

export const getPlayerBalance = async () => {
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

export const claim = async () => {
  if (!isInitialized) {
    await init();
  }

  await contract.methods
    .approve(convertLBC(0))
    .send({ from: selectedAccount })
    .then((approve: any) => {
      return approve;
    });

  return contract.methods
    .claimBalance(convertLBC(0))
    .send({ from: selectedAccount });
};

export const startGame = async () => {
  if (!isInitialized) {
    await init();
  }

  await contract.methods
    .approve(convertLBC(4))
    .send({ from: selectedAccount })
    .then((approve: any) => {
      return approve;
    });

  const response = await contract.methods
    .startGame(convertLBC(4))
    .send({ from: selectedAccount });

  return response;
};

export const correctAnswer = async () => {
  const response = await contract.methods
    .correctAnswer(convertLBC(2))
    .send({ from: selectedAccount });

  return response;
};

export const incorrectAnswer = async () => {
  const response = await contract.methods
    .incorrectAnswer(convertLBC(2))
    .send({ from: selectedAccount });

  return response;
};
