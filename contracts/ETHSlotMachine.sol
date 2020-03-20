pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Address.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";


contract ETHSlotMachine is Initializable, Ownable {
  using SafeMath for uint256;
  using Address for address payable;
  uint256 public pot;
  uint256 public price;
  uint256 public jackpot_number;
  uint256 private _ran_num;
  uint256 private _seed;
  uint256 private _total;
  uint256 private _win;
  address payable collecter;

  event Win(address indexed _winner, string _prize, uint256 _value);
  event Deposit(address indexed _depositor, uint256 _value);
  event SetPrice(uint256 _newPrice);

  modifier costs(uint256 _price) {
    require(msg.value >= _price);
    _;
  }

  function initialize(uint256 seed, uint256 jackpot)
    public
    payable
    initializer
  {
    require(msg.value > 0);
    Ownable.initialize(msg.sender);
    collecter = msg.sender;
    price = msg.value;
    jackpot_number = jackpot;
    _seed = seed;
    pot = pot.add(msg.value);
  }

  function() external payable {
    uint256 fee = (msg.value).div(50);
    uint256 pot_val = (msg.value).sub(fee);
    collecter.sendValue(fee);
    pot = pot.add(pot_val);
    emit Deposit(msg.sender, pot_val);
  }

  function getLucky() external payable costs(price) {
    uint256 ran = _random();
    uint256 amount = pot;
    _total = _total.add(1);
    if (ran == jackpot_number) {
      //send 100% pot value
      pot = 0;
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      _win = _win.add(1);
      emit Win(msg.sender, "First Prize", amount);
      return;
    } else if (ran.mod(20) == 0) {
      //send 20%
      amount = amount.div(5);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      _win = _win.add(1);
      emit Win(msg.sender, "Second Prize", amount);
      return;
    } else if (ran.mod(10) == 0) {
      //send 10%
      amount = amount.div(10);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      _win = _win.add(1);
      emit Win(msg.sender, "Third Prize", amount);
      return;
    } else if (ran.mod(4) == 0) {
      //send 4%
      amount = amount.div(25);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      _win = _win.add(1);
      emit Win(msg.sender, "Forth Prize", amount);
      return;
    } else if (ran.mod(2) == 0) {
      //send 2%
      amount = amount.div(50);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      _win = _win.add(1);
      emit Win(msg.sender, "Fifth Prize", amount);
      return;
    } else {
      uint256 fee = (msg.value).div(50);
      uint256 pot_val = (msg.value).sub(fee);
      collecter.sendValue(fee);
      pot = pot.add(pot_val);
      emit Deposit(msg.sender, pot_val);
    }
  }

  /* 
     Generates a random number from 0 to 100 based on the last block hash 
     unsafe, a miner can influence the number by not publishing a block with an 
     unwanted outcome, and forfeiting the 5 block reward.
  */
  function _random() private returns (uint256 randomNumber) {
    return (uint256(
      keccak256(abi.encodePacked(blockhash(block.number - 1), _seed))
    ) % 100);
  }

  function updatePrice(uint256 newPrice) public onlyOwner {
    require(newPrice > 0);
    price = newPrice;
    emit SetPrice(newPrice);
  }

  function updateSeed(uint256 seed) public onlyOwner {
    _seed = seed;
  }

  function updateJackpotNumber(uint256 num) public onlyOwner {
    jackpot_number = num;
  }

  function getOdds() public view returns (uint256, uint256) {
    return (_win, _total);
  }
}
