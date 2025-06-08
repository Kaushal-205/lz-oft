// SPDX-License-Identifier: GPL
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@layerzerolabs/oft-evm/contracts/OFT.sol";
import "@layerzerolabs/oft-evm/contracts/interfaces/IOFT.sol";

contract TGNToken_Canonical is OFT, ERC20Permit, ERC20Votes {
    error InvalidInput();
    uint256 public constant MAX_SUPPLY = 300_000_000 * 10 ** 18;

    mapping(address => bool) public isTimelocked;
    mapping(address => uint256) public transferLock;

    constructor(address _lzEndpoint, address _delegate)
        ERC20Permit("TGNToken")
        OFT("TGNToken", "TGN", _lzEndpoint, _delegate)
        Ownable(_delegate)
    {}

    /// @notice Mint tokens with a time lock. Only on the canonical chain.
    function mintWithTimelock(address to, uint256 amount, uint256 releaseDate) public onlyOwner {
        if (to == address(0) || amount == 0) revert InvalidInput();
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        require(releaseDate > block.timestamp, "Invalid release time");

        _mint(to, amount);
        isTimelocked[to] = true;
        transferLock[to] = releaseDate;
    }

    /// @notice Standard minting. Only on canonical chain.
    function mint(address to, uint256 amount) public virtual onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Invalid amount");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");

        _mint(to, amount);
    }

    /// @notice Override timelock manually.
    function overrideTimelock(address _address) external onlyOwner {
        require(isTimelocked[_address], "Address not timelocked");
        isTimelocked[_address] = false;
    }

    

    /// @notice Enforces timelock checks on transfer
    function transfer(address to, uint256 amount) public virtual override(ERC20) returns (bool) {
        address owner = _msgSender();
        if (isTimelocked[owner]) {
            require(transferLock[owner] <= block.timestamp, "Tokens are timelocked");
        }
        return super.transfer(to, amount);
    }

    /// @notice Enforces timelock checks on transferFrom
    function transferFrom(address from, address to, uint256 amount) public virtual override(ERC20) returns (bool) {
        if (isTimelocked[from]) {
            require(transferLock[from] <= block.timestamp, "Tokens are timelocked");
        }
        return super.transferFrom(from, to, amount);
    }

    /// @notice Override _debit to enforce timelock checks on cross-chain transfers
    function _debit(
        address _from,
        uint256 _amountLD,
        uint256 _minAmountLD,
        uint32 _dstEid
    ) internal virtual override returns (uint256 amountSentLD, uint256 amountReceivedLD) {
        // Check timelock before allowing cross-chain transfers
        if (isTimelocked[_from]) {
            require(transferLock[_from] <= block.timestamp, "Tokens are timelocked");
        }
        
        // Call parent _debit function
        return super._debit(_from, _amountLD, _minAmountLD, _dstEid);
    }

    // --- Required Overrides ---
    function _update(address from, address to, uint256 value)
        internal
        virtual
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
