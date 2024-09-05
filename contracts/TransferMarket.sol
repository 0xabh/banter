// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PlayerTokenAMM {
    using SafeERC20 for IERC20;

    address public owner;
    IERC20 public baseToken;
    struct Pool {
        uint256 baseTokenReserve;
        uint256 playerTokenReserve;
    }

    mapping(address => Pool) public pools;
    address[] public playerTokens;

    event PoolCreated(address indexed playerToken);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _baseToken, address _owner) {
        baseToken = IERC20(_baseToken);
        owner = _owner;
    }

    function createPool(
        address _playerToken,
        uint256 _initialLiquidity,
        uint256 _price
    ) external onlyOwner {
        require(
            pools[_playerToken].baseTokenReserve == 0,
            "Pool already exists"
        );

        IERC20 playerToken = IERC20(_playerToken);

        uint256 baseTokenAmount = _price * _initialLiquidity;
        uint256 playerTokenAmount = _initialLiquidity;

        baseToken.safeTransferFrom(msg.sender, address(this), baseTokenAmount);
        playerToken.safeTransferFrom(
            msg.sender,
            address(this),
            playerTokenAmount
        );

        Pool storage newPool = pools[_playerToken];
        newPool.baseTokenReserve = baseTokenAmount;
        newPool.playerTokenReserve = playerTokenAmount;
        playerTokens.push(_playerToken);

        emit PoolCreated(_playerToken);
    }

    function buyPlayerToken(address _playerToken) external onlyOwner {
        Pool storage pool = pools[_playerToken];
        require(pool.baseTokenReserve > 0, "Pool does not exist");

        uint256 currentPrice = getCurrentPlayerPrice(_playerToken);
        require(
            baseToken.balanceOf(msg.sender) >= currentPrice,
            "Insufficient base tokens to buy Player token."
        );

        baseToken.safeTransferFrom(msg.sender, address(this), currentPrice);
        IERC20(_playerToken).safeTransfer(msg.sender, 1e18);

        pool.baseTokenReserve += currentPrice;
        pool.playerTokenReserve -= 1e18;
    }

    function sellPlayerToken(
        address _playerToken,
        uint256 price
    ) external onlyOwner {
        Pool storage pool = pools[_playerToken];
        require(pool.baseTokenReserve > 0, "Pool does not exist");

        IERC20(_playerToken).safeTransferFrom(msg.sender, address(this), 1e18);
        baseToken.safeTransfer(msg.sender, price);

        pool.playerTokenReserve += 1e18;
        pool.baseTokenReserve -= price;
    }

    function getCurrentPlayerPrice(
        address _playerToken
    ) public view returns (uint256) {
        Pool storage pool = pools[_playerToken];
        require(pool.baseTokenReserve > 0, "Pool does not exist");
        return (pool.baseTokenReserve * 1e18) / pool.playerTokenReserve;
    }
}
