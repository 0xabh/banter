// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract PlayerToken is ERC20 {
    uint256 public position;
    uint256 public team;
    address public owner;

    constructor(
        string memory name,
        string memory symbol,
        uint256 _position,
        uint256 _team
    ) ERC20(name, symbol) {
        position = _position;
        team = _team;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "you are not the owner");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount * 1e18);
    }
}