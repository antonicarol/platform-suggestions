// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SuggestionHanlder is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public suggestionsIds;

    mapping(uint256 => Suggestion) public suggestions;
    mapping(uint256 => uint256) public suggestionsProgress;

    struct Suggestion {
        address payable creator;
        uint256 totalAmount;
        string title;
        string description;
    }

    event AmmountAdded(
        uint256 amount,
        uint256 suggestionId,
        Suggestion suggestion
    );

    event SuggestionCreated(uint256 suggestionId, Suggestion suggestion);

    event AmmountCompleted(uint256 suggestionId, Suggestion suggestion);

    constructor() public {}

    modifier suggestionExists(uint256 _suggestionId) {
        Suggestion memory _suggestion = suggestions[_suggestionId];
        require(
            _suggestion.creator != address(0),
            "Suggestion does not exist!"
        );

        _;
    }

    modifier suggestionFinished(uint256 _suggestionId) {
        Suggestion memory _suggestion = suggestions[_suggestionId];
        uint256 progress = suggestionsProgress[_suggestionId];
        require(
            progress >= _suggestion.totalAmount,
            "Suggestion has reached the total amount!"
        );

        _;
    }

    modifier suggestionInProgress(uint256 _suggestionId) {
        Suggestion memory _suggestion = suggestions[_suggestionId];
        uint256 progress = suggestionsProgress[_suggestionId];
        require(
            progress < _suggestion.totalAmount,
            "Suggestion has reached the total amount!"
        );

        _;
    }

    function createSuggestion(
        string memory _title,
        string memory _description,
        uint256 _totalAmount
    ) external onlyOwner {
        require(_totalAmount > 10, "Total amount must be higher than 10!");

        suggestionsIds.increment();

        uint256 newSuggestionId = suggestionsIds.current();

        suggestions[newSuggestionId] = Suggestion(
            payable(msg.sender),
            _totalAmount,
            _title,
            _description
        );

        emit SuggestionCreated(newSuggestionId, suggestions[newSuggestionId]);
    }

    function addTokensToSuggestion(uint256 _suggestionId)
        external
        payable
        suggestionExists(_suggestionId)
        suggestionInProgress(_suggestionId)
    {
        uint256 progress = suggestionsProgress[_suggestionId];

        uint256 newProgress = progress + msg.value;

        suggestionsProgress[_suggestionId] = newProgress;
    }

    function withdrawFromSuggestion(uint256 _suggestionId)
        external
        payable
        suggestionExists(_suggestionId)
        suggestionFinished(_suggestionId)
        onlyOwner
    {
        uint256 totalInSuggestion = suggestionsProgress[_suggestionId];

        payable(msg.sender).transfer(totalInSuggestion);
    }
}
