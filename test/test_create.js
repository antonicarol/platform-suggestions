const Suggestions = artifacts.require("SuggestionHanlder");
const Web3 = require("web3");

const server = new Web3(
  new Web3.providers.HttpProvider("http://localhost:8545")
);

contract("Test full Suggestions", (accounts) => {
  it("Should create a suggestion", async () => {
    const SuggestionsInstance = await Suggestions.deployed();
    const newSuggestion = {
      title: "New Suggestion",
      totalAmount: Web3.utils.toWei("50"),
    };
    await SuggestionsInstance.createSuggestion(
      newSuggestion.title,
      newSuggestion.title,
      newSuggestion.totalAmount
    );

    let suggestionId = await SuggestionsInstance.suggestionsIds();
    console.log(suggestionId);

    const createdSuggestion = await SuggestionsInstance.suggestions(
      suggestionId
    );

    const formattedAmount = Web3.utils.fromWei(createdSuggestion.totalAmount);

    assert(createdSuggestion.title == "New Suggestion", "Result not equal");
    assert(formattedAmount == 50);
  });

  it("Should deposit into a suggestion", async () => {
    const SuggestionsInstance = await Suggestions.deployed();
    const newSuggestion = {
      title: "New Suggestion",
      totalAmount: Web3.utils.toWei("50"),
    };
    await SuggestionsInstance.createSuggestion(
      newSuggestion.title,
      newSuggestion.title,
      newSuggestion.totalAmount
    );

    let suggestionId = await SuggestionsInstance.suggestionsIds();

    const createdSuggestion = await SuggestionsInstance.suggestions(
      suggestionId
    );

    const formattedAmount = Web3.utils.fromWei(createdSuggestion.totalAmount);

    assert(createdSuggestion.title == "New Suggestion", "Result not equal");
    assert(formattedAmount == 50);

    await SuggestionsInstance.addTokensToSuggestion(suggestionId, {
      value: Web3.utils.toWei("20"),
    });

    const server = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );

    const suggestionProgress = await SuggestionsInstance.suggestionsProgress(
      suggestionId
    );
    const formmatedProgress = Web3.utils.fromWei(suggestionProgress);
    console.log(formmatedProgress);
    const contractBalance = await server.eth.getBalance(
      SuggestionsInstance.address
    );
    const formattedBalance = Web3.utils.fromWei(contractBalance);
    assert(formmatedProgress == 20, "Progress does not match");
    assert(formattedBalance == 20, "Contract Balance does not match");
  });

  it("Should withdraw funds from ended suggestion", async () => {
    const SuggestionsInstance = await Suggestions.deployed();
    const newSuggestion = {
      title: "New Suggestion",
      totalAmount: Web3.utils.toWei("50"),
    };
    await SuggestionsInstance.createSuggestion(
      newSuggestion.title,
      newSuggestion.title,
      newSuggestion.totalAmount
    );

    let suggestionId = await SuggestionsInstance.suggestionsIds();

    const createdSuggestion = await SuggestionsInstance.suggestions(
      suggestionId
    );

    const formattedAmount = Web3.utils.fromWei(createdSuggestion.totalAmount);

    assert(createdSuggestion.title == "New Suggestion", "Result not equal");
    assert(formattedAmount == 50);

    await SuggestionsInstance.addTokensToSuggestion(suggestionId, {
      value: Web3.utils.toWei("50"),
    });

    const server = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );

    const accounts = await server.eth.getAccounts();

    const accountBalance = await server.eth.getBalance(accounts[0]);
    const formmatedBalance = Web3.utils.fromWei(accountBalance);

    const suggestionProgress = await SuggestionsInstance.suggestionsProgress(
      suggestionId
    );
    const formmatedProgress = Web3.utils.fromWei(suggestionProgress);
    console.log(formmatedProgress);
    assert(formmatedProgress == 50, "Progress does not match");

    await SuggestionsInstance.withdrawFromSuggestion(suggestionId, {
      from: accounts[0],
    });

    const newAccountBalance = await server.eth.getBalance(accounts[0]);
    const formmatedNewBalance = Web3.utils.fromWei(newAccountBalance);

    const diff = formmatedNewBalance - formmatedBalance;
    console.log(diff);

    assert(Math.round(diff) === 50, "Dif is not 50!");
  });

  it("Should fail when we withdraw, we're not the owner!", async () => {
    const server = new Web3(
      new Web3.providers.HttpProvider("http://localhost:8545")
    );

    const accounts = await server.eth.getAccounts();

    const ownerAccount = accounts[0];
    const notOwnerAccount = accounts[1];

    const SuggestionsInstance = await Suggestions.deployed();

    const newSuggestion = {
      title: "New Suggestion",
      totalAmount: Web3.utils.toWei("50"),
    };
    await SuggestionsInstance.createSuggestion(
      newSuggestion.title,
      newSuggestion.title,
      newSuggestion.totalAmount
    );

    let suggestionId = await SuggestionsInstance.suggestionsIds();

    const createdSuggestion = await SuggestionsInstance.suggestions(
      suggestionId
    );

    const formattedAmount = Web3.utils.fromWei(createdSuggestion.totalAmount);

    assert(createdSuggestion.title == "New Suggestion", "Result not equal");
    assert(formattedAmount == 50);

    await SuggestionsInstance.addTokensToSuggestion(suggestionId, {
      value: Web3.utils.toWei("50"),
    });

    const accountBalance = await server.eth.getBalance(accounts[0]);
    const formmatedBalance = Web3.utils.fromWei(accountBalance);

    const suggestionProgress = await SuggestionsInstance.suggestionsProgress(
      suggestionId
    );
    const formmatedProgress = Web3.utils.fromWei(suggestionProgress);
    console.log(formmatedProgress);
    assert(formmatedProgress == 50, "Progress does not match");

    await SuggestionsInstance.withdrawFromSuggestion(suggestionId, {
      from: accounts[1],
    });
  });
});
