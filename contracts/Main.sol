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

    mapping(address => Player) public players;
    mapping(uint256 => League) public leagues;

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
    
}
