// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
//import "hardhat/console.sol";
import "./ExternalContract.sol";

contract Staker {
    mapping(address => uint256) public balances;
    uint256 public constant threshold = 1 ether;
    uint256 public deadline = block.timestamp + 30 seconds;
    uint256 public totalStaked;

    function stake() public payable {
        require(block.timestamp < deadline, "Staking period is over");
        balances[msg.sender] += msg.value;
        totalStaked += msg.value;
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
    }

    function timeLeft() public view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        } else {
            return deadline - block.timestamp;
        }
    }
}