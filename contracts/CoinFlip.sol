// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleCoinFlip {
    address public owner;
    uint public lastFlipTime;
    uint public minimumBet = 0.0001 ether;

    event CoinFlipped(address indexed player, bool side, bool outcome, uint amountWon);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier nonReentrant() {
        require(reentrancyGuard == 0, "Reentrancy detected");
        reentrancyGuard = 1;
        _;
        reentrancyGuard = 0;
    }

    uint256 private reentrancyGuard;

    constructor() {
        owner = msg.sender;
        lastFlipTime = block.timestamp;
        reentrancyGuard = 0; // Initialize the reentrancy guard
    }

    function flip(bool _side) public payable nonReentrant {
        require(msg.value >= minimumBet, "Must send at least the minimum bet amount");
        require(block.timestamp >= lastFlipTime + 1 minutes, "Please wait before flipping again");

        lastFlipTime = block.timestamp;

        // Pseudo-randomness using block attributes
        uint256 random = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender))) % 2;
        bool outcome = (random == 1);

        uint256 prize = 0;
        if (outcome == _side) {
            prize = msg.value * 2;
            require(address(this).balance >= prize, "Insufficient contract balance");
            payable(msg.sender).transfer(prize);
        }

        emit CoinFlipped(msg.sender, _side, outcome, prize);
    }

    function fundContract() public payable onlyOwner {
        // Owner can fund the contract with ETH
    }

    function withdrawFunds(uint _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance in the contract");
        payable(owner).transfer(_amount);
    }

    // Fallback function to accept ETH
    receive() external payable {}
}
