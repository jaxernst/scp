// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * A contestable commitment extension can be applied to scheduled commitments 
 * that only accepted confirmations with proof URIs. 
 * 
 * Contestations require a vote to be opened, where other users will vote if the 
 * commitment was actually completed with the provided proof. 
 */