// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.30;

import { TGNToken_Canonical } from "../OFT_Canonical.sol";

// @dev WARNING: This is for testing purposes only
contract TGNToken_CanonicalMock is TGNToken_Canonical {
    constructor(
        address _lzEndpoint,
        address _delegate
    ) TGNToken_Canonical(_lzEndpoint, _delegate) {}

    function mint(address _to, uint256 _amount) public override {
        _mint(_to, _amount);
    }
}
