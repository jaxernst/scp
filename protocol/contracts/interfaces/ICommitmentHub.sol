// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../types.sol";

interface ICommitmentHub {
    function emitUserJoined(
        RegisteredCommitmentType _type,
        address user
    ) external;
}
