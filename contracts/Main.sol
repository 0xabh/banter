// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./PlayerToken.sol";

interface IPlayerTokenAMM {
    function createPool(
        address _playerToken,
        uint256 _initialLiquidity,
        uint256 _price
    ) external;

    function buyPlayerToken(address _playerToken) external;

    function sellPlayerToken(address _playerToken, uint256 price) external;

    function getCurrentPlayerPrice(
        address _playerToken
    ) external view returns (uint256);
}

contract BanterFantasySports is ReentrancyGuard {
    address public owner;
    IPlayerTokenAMM public playerTokenAMM;
    IERC20 public baseToken;
    uint256 nextleagueId = 1;
    uint256 public virtualBalance = 10 * 1e18;
    struct Player {
        PlayerToken token;
        uint256 price;
    }
    struct League {
        string description;
        uint256 totalStakes;
        uint256 resolveTime;
        uint256 gameWeek;
        uint256 gameWeekDuration;
        bool resolved;
    }
    struct UserTeam {
        mapping(address => uint256) players;
        address[] playerAddress;
        uint256 allotedBalance;
        uint256 totalValue;
    }

    mapping(address => Player) public players;
    mapping(uint256 => League) public leagues;
    mapping(uint256 => mapping(address => UserTeam)) public leagueTeams;
    mapping(uint256 => address[]) leagueUsers;

    event PlayerAdded(
        address indexed tokenAddress,
        string name,
        uint256 position,
        uint256 team,
        uint256 price
    );
    event LeagueCreated(uint256 indexed leagueId, string description);
    event TeamCreated(
        address indexed user,
        address[] playyerTokens,
        uint256 leagueId
    );
    event PlayerBought(
        address indexed player,
        address owner,
        uint256 buyPrice,
        uint256 leagueId
    );
    event PlayerSold(
        address indexed player,
        address owner,
        uint256 soldPrice,
        uint256 leagueId
    );
    event RewardsClaimed(address user);

    modifier onlyOwner() {
        require(owner == msg.sender, "you are not the owner");
        _;
    }

    modifier isTeamOwned(uint256 _leagueId) {
        require(
            leagueTeams[_leagueId][msg.sender].playerAddress.length != 0,
            "You didn't own a team"
        );
        _;
    }

    constructor(
        address _baseTokenAddress,
        address _playerTokenAMMAddress,
        address _owner
    ) {
        baseToken = IERC20(_baseTokenAddress);
        playerTokenAMM = IPlayerTokenAMM(_playerTokenAMMAddress);
        owner = _owner;
    }

    function addPlayer(
        string memory _name,
        string memory _symbol,
        uint256 _position,
        uint256 _team,
        uint256 _price,
        uint256 _initialSupply,
        uint256 _poolSupply
    ) external onlyOwner {
        PlayerToken newPlayerToken = new PlayerToken(
            _name,
            _symbol,
            _position,
            _team
        );
        players[address(newPlayerToken)] = Player(
            newPlayerToken,
            _price * 1e18
        );
        newPlayerToken.mint(address(this), _initialSupply);
        baseToken.approve(address(playerTokenAMM), _price * _poolSupply * 1e18);
        newPlayerToken.approve(address(playerTokenAMM), _poolSupply * 1e18);
        playerTokenAMM.createPool(
            address(newPlayerToken),
            _poolSupply * 1e18,
            _price
        );
        emit PlayerAdded(
            address(newPlayerToken),
            _name,
            _position,
            _team,
            _price * 1e18
        );
    }

    function createTeam(
        address[] calldata _playerTokens,
        uint256 _leagueId
    ) external payable {
        require(
            _playerTokens.length <= 11,
            "Can't select more than 11 players"
        );
        require(
            _leagueId < nextleagueId && _leagueId != 0,
            "League doesn't exist"
        );
        require(
            leagueTeams[_leagueId][msg.sender].playerAddress.length == 0,
            "You already own a team"
        );
        require(msg.value == 10 * 1e18, "Stake chz to create team");
        leagues[_leagueId].totalStakes += 10 * 1e18;
        leagueUsers[_leagueId].push(msg.sender);
        leagueTeams[_leagueId][msg.sender].allotedBalance = virtualBalance;
        require(
            getTotalPrice(_playerTokens) <= virtualBalance,
            "Total price exceeds 10 Base token"
        );
        uint256 totalValue = 0;
        for (uint256 i = 0; i < _playerTokens.length; i++) {
            address playerTokenAddress = _playerTokens[i];
            require(players[playerTokenAddress].price > 0, "Invalid player");
            leagueTeams[_leagueId][msg.sender].players[
                playerTokenAddress
            ] = players[playerTokenAddress].price;
            leagueTeams[_leagueId][msg.sender].playerAddress.push(
                playerTokenAddress
            );
            IERC20 playerToken = IERC20(playerTokenAddress);
            playerToken.transfer(msg.sender, 1e18);
            totalValue += players[playerTokenAddress].price;
        }
        leagueTeams[_leagueId][msg.sender].totalValue = totalValue;
        leagueTeams[_leagueId][msg.sender].allotedBalance -= totalValue;
        emit TeamCreated(msg.sender, _playerTokens, _leagueId);
    }

    function buyPLayer(
        address _buyPlayerToken,
        uint256 _leagueId
    ) external payable isTeamOwned(_leagueId) {
        require(
            _leagueId < nextleagueId && _leagueId != 0,
            "League doesn't exist"
        );
        require(
            leagueTeams[_leagueId][msg.sender].players[_buyPlayerToken] == 0,
            "You already own this player"
        );
        require(msg.value == 5 * 1e17, "Give the fees for transfering");
        uint256 currentPrice = playerTokenAMM.getCurrentPlayerPrice(
            _buyPlayerToken
        );
        uint256 totalValue = leagueTeams[_leagueId][msg.sender].totalValue;
        require(
            leagueTeams[_leagueId][msg.sender].allotedBalance >= currentPrice,
            "you don't have balance to buy this player"
        );
        totalValue += currentPrice;
        leagueTeams[_leagueId][msg.sender].totalValue = totalValue;
        baseToken.approve(address(playerTokenAMM), currentPrice);
        playerTokenAMM.buyPlayerToken(_buyPlayerToken);
        leagueTeams[_leagueId][msg.sender].playerAddress.push(_buyPlayerToken);
        leagueTeams[_leagueId][msg.sender].players[
            _buyPlayerToken
        ] = currentPrice;
        leagueTeams[_leagueId][msg.sender].allotedBalance -= currentPrice;
        emit PlayerBought(_buyPlayerToken, msg.sender, currentPrice, _leagueId);
    }

    function sellPLayer(
        address _sellPlayerToken,
        uint256 _leagueId
    ) external payable isTeamOwned(_leagueId) {
        require(
            leagueTeams[_leagueId][msg.sender].players[_sellPlayerToken] != 0,
            "You don't own this player"
        );
        require(
            _leagueId < nextleagueId && _leagueId != 0,
            "League doesn't exist"
        );
        require(msg.value == 5 * 1e17, "Give the fees for transfering");
        uint256 currentPrice = playerTokenAMM.getCurrentPlayerPrice(
            _sellPlayerToken
        );
        uint256 price = abs(
            currentPrice,
            leagueTeams[_leagueId][msg.sender].players[_sellPlayerToken]
        );
        uint256 totalValue = leagueTeams[_leagueId][msg.sender].totalValue;
        totalValue -= leagueTeams[_leagueId][msg.sender].players[
            _sellPlayerToken
        ];
        leagueTeams[_leagueId][msg.sender].totalValue = totalValue;
        IERC20 playerToken = IERC20(_sellPlayerToken);
        playerToken.approve(address(playerTokenAMM), 1e18);
        playerTokenAMM.sellPlayerToken(_sellPlayerToken, price);
        leagueTeams[_leagueId][msg.sender].allotedBalance += price;
        delete leagueTeams[_leagueId][msg.sender].players[_sellPlayerToken];
        _removePlayerAddress(
            leagueTeams[_leagueId][msg.sender],
            _sellPlayerToken
        );
        emit PlayerSold(_sellPlayerToken, msg.sender, price, _leagueId);
    }

    function createLeagues(
        string memory _description,
        uint256 _resolveTime
    ) external onlyOwner {
        require(_resolveTime >= block.timestamp, "Invalid resolved time");
        League storage newLeague = leagues[nextleagueId];
        newLeague.description = _description;
        newLeague.resolveTime = _resolveTime;
        newLeague.gameWeekDuration = (_resolveTime - block.timestamp) / 5;
        newLeague.gameWeek = 1;
        emit LeagueCreated(nextleagueId, _description);
        nextleagueId++;
    }

    function getTotalPrice(
        address[] memory _playerTokens
    ) internal view returns (uint256) {
        uint256 totalValue = 0;
        for (uint256 i = 0; i < _playerTokens.length; i++) {
            require(players[_playerTokens[i]].price > 0, "Invalid player");
            totalValue += players[_playerTokens[i]].price;
        }
        return totalValue;
    }

    function abs(
        uint256 currentPrice,
        uint256 previousPrice
    ) internal pure returns (uint256) {
        if (currentPrice > previousPrice) {
            uint256 increase = currentPrice - previousPrice;
            uint256 adjustedPrice = previousPrice + (increase / 2);
            return adjustedPrice;
        } else {
            return currentPrice;
        }
    }

    function _removePlayerAddress(
        UserTeam storage team,
        address playerAddress
    ) internal {
        uint256 length = team.playerAddress.length;
        for (uint256 i = 0; i < length; i++) {
            if (team.playerAddress[i] == playerAddress) {
                team.playerAddress[i] = team.playerAddress[length - 1];
                team.playerAddress.pop();
                break;
            }
        }
    }

    function claimRewards(uint256 _leagueId) external isTeamOwned(_leagueId) {
        require(
            _leagueId < nextleagueId && _leagueId != 0,
            "League doesn't exist"
        );
        require(leagues[_leagueId].gameWeek < 5, "can't claim");
        uint256 gameWeekEndTime = leagues[_leagueId].resolveTime -
            leagues[_leagueId].gameWeekDuration *
            (5 - leagues[_leagueId].gameWeek);

        require(
            block.timestamp >= gameWeekEndTime,
            "Can't claim rewards yet for this game week"
        );
        require(getTopUser(_leagueId) == msg.sender, "You can't claim rewards");
        uint256 totalWinningStakes = leagues[_leagueId].totalStakes;
        (bool success, ) = payable(msg.sender).call{value: totalWinningStakes}(
            ""
        );
        require(success == true, "transfer failed");
        delete leagueTeams[_leagueId][msg.sender];
        leagues[_leagueId].gameWeek++;
        leagues[_leagueId].totalStakes = 0;
        emit RewardsClaimed(msg.sender);
    }

    function getUserPlayers(
        uint256 _leagueId,
        address user
    ) public view returns (uint256) {
        return leagueTeams[_leagueId][user].playerAddress.length;
    }

    function getTopUser(uint256 _leagueId) public view returns (address) {
        uint256 max = 0;
        address user;
        for (uint256 i = 0; i < leagueUsers[_leagueId].length; i++) {
            uint256 value = leagueTeams[_leagueId][leagueUsers[_leagueId][i]]
                .totalValue;
            if (value > max) {
                max = value;
                user = leagueUsers[_leagueId][i];
            }
        }
        return user;
    }

    function getUsers(
        uint256 _leagueId
    ) public view returns (address[] memory) {
        return leagueUsers[_leagueId];
    }
}
