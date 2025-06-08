// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { TGNToken } from "../MyOFT.sol";

// @dev WARNING: This is for testing purposes only
contract TGNTokenMock is TGNToken {
    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) TGNToken(_name, _symbol, _lzEndpoint, _delegate) {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
