// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../BaseCommitment.sol";
import "../schedule-modules/AlarmSchedule.sol";
import "../penalty-modules/DonationPenalty.sol";

/**
 * Alarm clock pool MVP:
 * 
 * Qs: 
 * 
 * Do we want this to work with only a single user? 
 *  - This would use the same commitment but with a different penalty module
 *  - I'm thinking not. Timelocking funds is the only good single-user use case
 *    but timelocking funds is not cool or unique
 *  - Settled on single party for the MVP
 * 
 * Do we want users in a pool to be able to select different wakeup time?
 *  - I like the social implications of making all alarm pool users wakeup
 *    at the same time in their respective timezones. (So not actually the same time)
 * But maybe there should be some configuration for same time or different times?
 *  - It makes sense for the contracts to allow different time   
 *
 * 
 * How is a commitment pool setup?
 *  - Commitment pool acts like a factory. It pings the hub to create a commitment
 *    for a user when the user joins the pool.
 *  - When the last user joins the pool, the alarm activates?
 *  - Maybe there could be perpetual alarm clock pools that aren't p2p?
 *      - Yes this would be a cool feature but not fit for an MVP
 *   
 * Initialization flow (2 users) 
 *  - U1 creates a commitment pool from the hub, selecting wakeup time, bet size,
 *    penalty amount, and timezone. 
 *  - U2 joins the commitment pool (join by poolId). U2 only needs to specify 
 *    timezone, all other parameters were specified by the creator
 *  - The alarm automatically activates after U2 joins.
 *
 *  
 *  
 * 
 */

/*
contract AlarmClockPool is BaseCommitment {
    using AlarmSchedule for AlarmSchedule.Schedule; 
    using DonationPenalty for DonationPenalty.Penalty;
    
    struct UserEntry {
        uint timezone;
        DeadlineSchedule.Schedule schedule;
        DonationPenalty.Penalty penaltyTracker;
    }
    
    mapping(address => UserEntry) public userEntries;


    function init(bytes memory data) public initializer {
        uint alarmTime;
        uint depositVal;
        uint penalty;
        uint maxMembers;
        join()
    }

    function join() {
        
    }

    function submitConfirmation() public override {
        require(userSchedule[msg.sender]);
        userSchedule[msg.sender].recordEntry();
    }

}
*/