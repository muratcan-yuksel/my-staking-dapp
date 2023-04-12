// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
//import "hardhat/console.sol";
import "./ExternalContract.sol";

contract Staker {
    mapping(address => uint256) public balances;
    uint256 public constant threshold = 1 ether;
    uint256 public deadline = block.timestamp + 72 hours;
    uint256 public totalStaked;
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Executed();

    function stake() public payable {
        require(block.timestamp < deadline, "Staking period is over");
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value);
    }

    function withdraw() public {
        require(block.timestamp >= deadline, "Staking period is not over");
        require(
            totalStaked < 1 ether,
            " threshold is already reached, you've succeeded but can't withdraw anymore "
        );
        (bool success, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(success, "Transfer failed.");
        balances[msg.sender] = 0;
        totalStaked -= balances[msg.sender];
        emit Withdrawn(msg.sender, balances[msg.sender]);
    }

    function execute() public {
        require(block.timestamp >= deadline, "Staking period is not over");
        require(
            totalStaked >= 1 ether,
            " threshold is not reached, you can withdraw your funds "
        );
        ExternalContract externalContract = new ExternalContract();
        externalContract.complete{value: address(this).balance}();
        balances[msg.sender] = 0;
        totalStaked = 0;
        // deadline = block.timestamp + 30 seconds;
        emit Executed();
    }

    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }

    function userBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function totalBalance() public view returns (uint256) {
        return totalStaked;
    }

    function thresholdReached() public view returns (bool) {
        return totalStaked >= 1 ether;
    }
}
