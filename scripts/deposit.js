const Suggestions = artifacts.require("SuggestionHanlder");
const Web3 = require("web3");

const server = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

module.exports = async function (callback) {
  const accounts = await server.eth.getAccounts();
  var suggestionContract = await Suggestions.deployed();
  console.log(accounts[0]);
  const tx = await suggestionContract.addTokensToSuggestion(2, {
    from: accounts[1],
    value: Web3.utils.toWei("52"),
  });
  callback(tx);
};
