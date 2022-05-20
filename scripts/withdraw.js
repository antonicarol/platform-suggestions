const Suggestions = artifacts.require("SuggestionHanlder");
const ganache = require("ganache");
const Web3 = require("web3");

const server = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

module.exports = async function (callback) {
  const accounts = await server.eth.getAccounts();
  var suggestionContract = await Suggestions.deployed();
  const tx = await suggestionContract.withdrawFromSuggestion(2, {
    from: accounts[0],
  });
  const accountBalance = await server.eth.getBalance(accounts[0]);
  callback(accountBalance);
};
