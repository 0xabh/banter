// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TransferMarket.sol";

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
        owner=msg.sender;
    }

    modifier onlyOwner{
        require(owner==msg.sender,"you are not the owner");
        _;
    }
    function mint(address to, uint256 amount) external onlyOwner{
        _mint(to, amount * 1e18);
    }
}

contract BanterFantasySports {
    address public owner;
    PlayerTokenAMM public playerTokenAMM;
    IERC20 public chzToken;
    uint256 nextleagueId=1;
    struct Player {
        PlayerToken token;
        uint256 price; // in CHZ
    }
    struct League {
        string description;
        uint256 resolveTime;
        mapping(bool => uint256) totalStakes;
        mapping(address => mapping(bool => uint256)) userStakes;
        bool resolved;
        bool outcome;
    }
    struct UserTeam {
        mapping(address => uint256) players;
        address[] playerAddress;
        uint256 totalValue;
    }

    mapping(address => Player) public players;
    mapping(uint256 => League) public leagues;
    mapping(uint256 => mapping(address => UserTeam)) public leagueTeams;

    event PlayerAdded(
        address indexed tokenAddress,
        string name,
        uint256 position,
        uint256 team,
        uint256 price
    );
    event LeagueCreated(
        uint256 indexed leagueId,
        string description,
        uint256 resolveTime
    );
    event TeamCreated(
        address indexed user,
        address[] playyerTokens,
        uint256 leagueId
    );


    modifier onlyOwner{
        require(owner==msg.sender,"you are not the owner");
        _;
    }

    constructor(
        address _chzTokenAddress,
        address _playerTokenAMMAddress,
        address _owner
    ) {
        chzToken = IERC20(_chzTokenAddress);
        playerTokenAMM = PlayerTokenAMM(_playerTokenAMMAddress);
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
        chzToken.approve(address(playerTokenAMM), _poolSupply * 1e18);
        newPlayerToken.approve(address(playerTokenAMM), _poolSupply * 1e18);
        playerTokenAMM.createPool(address(newPlayerToken), _poolSupply * 1e18);
        emit PlayerAdded(
            address(newPlayerToken),
            _name,
            _position,
            _team,
            _price * 1e18
        );
    }

    function createLeagues(string memory _description, uint256 _resolveTime)
        external
        onlyOwner
    {
        require(_resolveTime > block.timestamp, "Invalid resolve time");
        League storage newLeague = leagues[nextleagueId];
        newLeague.description = _description;
        newLeague.resolveTime = _resolveTime;
        emit LeagueCreated(nextleagueId, _description, _resolveTime);
        nextleagueId++;
    }

    function createTeam(address[] memory _playerTokens, uint256 _leagueId)
        external
    {
        require(
            _playerTokens.length <= 11,
            "Can't select more than 11 players"
        );
        require(
            _leagueId <= nextleagueId && _leagueId != 0,
            "League doesn't exist"
        );
        require(
            leagueTeams[_leagueId][msg.sender].playerAddress.length == 0,
            "You already own a team"
        );

        uint256 totalPrice = getTotalPrice(_playerTokens);
        require(
            chzToken.allowance(msg.sender, address(this)) >= totalPrice,
            "Stake CHZ first"
        );
        uint256 totalValue = 0;

        for (uint256 i = 0; i < _playerTokens.length; i++) {
            address playerTokenAddress = _playerTokens[i];
            require(players[playerTokenAddress].price > 0, "Invalid player");
            require(
                leagueTeams[_leagueId][msg.sender].players[
                    playerTokenAddress
                ] == 0,
                "Already owned"
            );
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

        chzToken.transferFrom(msg.sender, address(this), totalPrice);
        leagueTeams[_leagueId][msg.sender].totalValue = totalValue;

        emit TeamCreated(msg.sender, _playerTokens, _leagueId);
    }
     function getTotalPrice(address[] memory _playerTokens)
        internal
        view
        returns (uint256)
    {
        uint256 totalValue = 0;
        for (uint256 i = 0; i < _playerTokens.length; i++) {
            require(players[_playerTokens[i]].price > 0, "Invalid player");
            totalValue += players[_playerTokens[i]].price;
        }
        return totalValue;
    }
    
}
