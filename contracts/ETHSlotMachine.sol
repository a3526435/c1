pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Address.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";


contract ETHSlotMachine is Initializable, Ownable {
  using SafeMath for uint256;
  using Address for address payable;

  struct Winner {
    address player;
    string message;
    uint256 value;
  }
  uint256 public pot;
  uint256 public price;
  uint256 public jackpot_number;
  uint256 private _ran_num;
  uint256 private _seed;
  uint256 public total;
  uint256 public win;
  address payable collecter;
  Winner[] public winners;

  event Response(
    address indexed _player,
    string _msg,
    uint256 _prizeId,
    uint256 _value
  );
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
    emit Response(msg.sender, "Deposit", 100, pot_val);
  }

  function getLucky() external payable costs(price) {
    require(pot > 0, "No money in pot");
    uint256 ran = _random();
    uint256 amount = pot;
    total = total.add(1);
    if (ran == jackpot_number) {
      //send 100% pot value
      pot = 0;
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      win = win.add(1);
      winners.push(
        Winner({
          player: msg.sender,
          message: "Won Frist Prize",
          value: amount
        })
      );
      emit Response(msg.sender, "Won First Prize", 0, amount);
      return;
    } else if (ran.mod(20) == 0) {
      //send 20%
      amount = amount.div(5);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      win = win.add(1);
      winners.push(
        Winner({
          player: msg.sender,
          message: "Won Second Prize",
          value: amount
        })
      );
      emit Response(msg.sender, "Won Second Prize", 1, amount);
      return;
    } else if (ran.mod(10) == 0) {
      //send 10%
      amount = amount.div(10);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      win = win.add(1);
      winners.push(
        Winner({
          player: msg.sender,
          message: "Won Third Prize",
          value: amount
        })
      );
      emit Response(msg.sender, "Won Third Prize", 2, amount);
      return;
    } else if (ran.mod(4) == 0) {
      //send 4%
      amount = amount.div(25);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      win = win.add(1);
      winners.push(
        Winner({
          player: msg.sender,
          message: "Won Forth Prize",
          value: amount
        })
      );
      emit Response(msg.sender, "Won Forth Prize", 3, amount);
      return;
    } else if (ran.mod(2) == 0) {
      //send 2%
      amount = amount.div(50);
      pot = pot.sub(amount);
      (msg.sender).sendValue(amount);
      msg.sender.transfer(msg.value);
      win = win.add(1);
      winners.push(
        Winner({
          player: msg.sender,
          message: "Won Fifth Prize",
          value: amount
        })
      );
      emit Response(msg.sender, "Won Fifth Prize", 4, amount);
      return;
    } else {
      uint256 fee = (msg.value).div(50);
      uint256 pot_val = (msg.value).sub(fee);
      collecter.sendValue(fee);
      pot = pot.add(pot_val);
      emit Response(msg.sender, "Lose", 5, pot_val);
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

  function getAllWinners() public view returns (Winner[] memory) {
    return winners;
  }
}
