pragma solidity >=0.8.0 <0.9.0;

//SPDX-License-Identifier: MIT

contract ExternalContract {
    bool public completed;

    function complete() public payable {
        completed = true;
    }
}
