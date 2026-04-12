// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Faucet {
    address public owner;
    uint256 public amountAllowed = 0.01 ether;

    mapping(address => uint256) public lastRequestTime;
    
    uint256 public constant lockTime = 24 hours;

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    function requestTokens() public {
        require(address(this).balance >= amountAllowed, "Faucet is empty!");
        require(block.timestamp >= lastRequestTime[msg.sender] + lockTime, "Wait for cooldown!");
        lastRequestTime[msg.sender] = block.timestamp;
        (bool success, ) = payable(msg.sender).call{value: amountAllowed}("");
        require(success, "Transfer failed.");
    }

    function withdrawAll() public {
        require(msg.sender == owner, "Only the Owner can do this!");
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Transfer failed.");
        
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}