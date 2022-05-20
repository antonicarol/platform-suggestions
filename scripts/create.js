const Suggestions = artifacts.require("SuggestionHanlder");
const ganache = require("ganache");
const Web3 = require("web3");
const ethers = require("ethers");
const server = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

module.exports = async function (callback) {
  const accounts = await server.eth.getAccounts();
  var suggestionContract = await Suggestions.deployed();
  console.log(accounts[0]);
  const tx = await suggestionContract.createSuggestion(
    "FTM integration",
    "Let users deposit FTM into the suggestions!",
    Web3.utils.toWei("50"),
    { from: accounts[0] }
  );

  callback(tx);
};
