const Suggestions = artifacts.require("SuggestionHanlder");
const ganache = require("ganache");
const Web3 = require("web3");

const server = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

module.exports = async function (callback) {
  const account = await server.eth.getAccounts()[0];
  var suggestionContract = await Suggestions.deployed();
  const tx = await suggestionContract.suggestions(1);
    
  const contractBalance = await server.eth.getBalance(
    suggestionContract.address
  );
  console.log(tx);
  callback(contractBalance);
};
