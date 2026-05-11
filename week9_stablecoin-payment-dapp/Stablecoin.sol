// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract MyStablecoin is ERC20, ERC20Permit, Ownable, Pausable {
    mapping(address => bool) private _blacklist;

    event Blacklisted(address indexed account);
    event UnBlacklisted(address indexed account);

    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        ERC20Permit(name) 
        Ownable(msg.sender) 
    {}

    // 관리자만 코인을 찍어낼 수 있음
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // 블랙리스트 기능
    function blacklist(address account) external onlyOwner {
        _blacklist[account] = true;
        emit Blacklisted(account);
    }

    function unBlacklist(address account) external onlyOwner {
        _blacklist[account] = false;
        emit UnBlacklisted(account);
    }

    // 전송 전 블랙리스트 및 일시중지 체크 (Hook)
    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        require(!_blacklist[from] && !_blacklist[to], "Blacklisted address");
        super._update(from, to, value);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }
}