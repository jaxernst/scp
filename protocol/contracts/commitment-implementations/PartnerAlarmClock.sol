// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
  The partner alarm clock is a commitment contract that allows two people to set an 'alarm'
  together, which represents an agreement for both parties to wake up at the same time on the
  designated days. To verify that each party has woken up, they simply need to submit a 
  confirmation transaction before the alarm time. Failure to do so can result in a penalty
  that will transfer funds to the other party.
 */
contract PartnerAlarmClock is BaseCommitment {

}
