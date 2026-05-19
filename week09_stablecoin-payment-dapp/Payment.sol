// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MeowPayment is Ownable {
    // 결제에 사용할 스테이블코인 주소 
    IERC20 public meowStable;
    
    // 돈을 받을 가맹점 주소
    address public merchant;
    
    // 수수료율 (단위: 1/10000, 300이면 3%)
    uint256 public feeRate = 300; 
    uint256 public constant FEE_DENOMINATOR = 10000;

    event Paid(address indexed customer, uint256 totalAmount, uint256 fee, uint256 merchantAmount);

    constructor(address _mscAddress, address _merchant) Ownable(msg.sender) {
        meowStable = IERC20(_mscAddress);
        merchant = _merchant;
    }

    // 결제 함수: 고객이 실행
    function pay(uint256 amount) external {
        uint256 fee = (amount * feeRate) / FEE_DENOMINATOR;
        uint256 merchantAmount = amount - fee;

        // 1. 고객으로부터 이 컨트랙트로 MSC를 가져옴
        require(meowStable.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // 2. 수수료를 제외한 금액을 가맹점주에게 전송
        require(meowStable.transfer(merchant, merchantAmount), "Merchant payment failed");

        emit Paid(msg.sender, amount, fee, merchantAmount);
    }

    // 쌓인 수수료를 인출하는 함수
    function withdrawFees() external onlyOwner {
        uint256 balance = meowStable.balanceOf(address(this));
        require(meowStable.transfer(owner(), balance), "Withdraw failed");
    }

    // 가맹점주 변경 함수
    function setMerchant(address _newMerchant) external onlyOwner {
        merchant = _newMerchant;
    }
}