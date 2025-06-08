// SPDX-License-Identifier: GPL
pragma solidity 0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@layerzerolabs/oft-evm/contracts/OFT.sol";
import "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";

contract TGNToken is OFT {
    constructor(address _lzEndpoint, address _delegate)
        OFT("TGNToken", "TGN", _lzEndpoint, _delegate)
        Ownable(_delegate)
    {}
}
