const Suggestions = artifacts.require("SuggestionHanlder");

module.exports = function (deployer) {
  deployer.deploy(Suggestions);
};
