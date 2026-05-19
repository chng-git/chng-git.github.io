// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "./CatToken.sol"; // 같은 폴더에 있을 때

contract StakingBank {
    IERC20 public stakingToken;
    address public owner;
    uint256 public rewardRate = 100; // 초당 보상

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastUpdate;
    mapping(address => uint256) public rewards;

    constructor(address _tokenAddress) {
        stakingToken = IERC20(_tokenAddress);
        owner = msg.sender;
    }

    modifier updateReward(address account) {
        rewards[account] = earned(account);
        lastUpdate[account] = block.timestamp;
        _;
    }

    function earned(address account) public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastUpdate[account];
        return rewards[account] + (stakedBalance[account] * rewardRate * timeElapsed / 1e18);
    }

    // 토큰 맡기기 (Stake)
    function stake(uint256 amount) public updateReward(msg.sender) {
        require(amount > 0, "Amount must be > 0");
        // 중요: 은행이 유저 지갑에서 토큰을 가져옴 (미리 Approve 필요)
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
    }

    // 토큰 찾기 (Withdraw)
    function withdraw() public updateReward(msg.sender) {
        uint256 amount = stakedBalance[msg.sender];
        uint256 reward = rewards[msg.sender];
        require(amount > 0, "No balance");

        stakedBalance[msg.sender] = 0;
        rewards[msg.sender] = 0;

        // 원금 + 이자 지급
        stakingToken.transfer(msg.sender, amount + reward);
    }
}