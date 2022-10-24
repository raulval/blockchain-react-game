// @ts-nocheck

import Web3 from "web3";

import NFTContractBuild from "./contracts/LubyGame.json";

declare let window: any;

let selectedAccount;
let nftContract;
let isInitialized = false;
let addressContract = "";

export const init = async () => {
  let provider = window.ethereum;

  if (typeof provider !== "undefined") {
    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`Selected accounts is ${selectedAccount}`);
      })
      .catch((error) => {
        console.log(error);
        return;
      });

    window.ethereum.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`Selected accounts is ${selectedAccount}`);
    });
  }
  const web3 = new Web3(provider);

  const networkId = await web3.eth.net.getId();
  console.log({ networkId });
  nftContract = new web3.eth.Contract(
    NFTContractBuild.abi,
    NFTContractBuild.networks[networkId].address
  );
  addressContract = NFTContractBuild.networks[networkId].address;
  isInitialized = true;
};
