// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract PlayerTokenAMM {
    address public owner;
    IERC20 public baseToken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    constructor(address _baseToken, address _owner) {
        baseToken = IERC20(_baseToken);
        owner = _owner;
    }
}
