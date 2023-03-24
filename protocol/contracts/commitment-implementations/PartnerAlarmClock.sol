// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
import "../BaseCommitment.sol";
import "../schedule-modules/AlarmSchedule.sol";
import "../penalty-modules/DonationPenalty.sol";

enum AlarmTimezoneMode {
    SAME_ABSOLUTE_TIME,
    SAME_RELATIVE_TIME
}

  The partner alarm clock is a commitment contract that allows two people to set an 'alarm'
  together, which represents an agreement for both parties to wake up at the same time on the
  designated days. To verify that each party has woken up, they simply need to submit a 
  confirmation transaction before the alarm time. Failure to do so can result in a penalty
  that will transfer funds to the other party.
 
contract PartnerAlarmClock is BaseCommitment {
    string constant IMPLEMENTATION_NAME = "Partner Alarm Clock";

    using AlarmSchedule for AlarmSchedule.Schedule;
    using DonationPenalty for DonationPenalty.Penalty;

    AlarmSchedule.Schedule party1Schedule;
    AlarmSchedule.Schedule party2Schedule;
    // TimelockPenalty.Timelock betDistributor;

    uint alarmTime;
    uint8[] alarmActiveDays;
    uint betDuration;
    uint betAmount;
    uint submissionWindow;
    uint timezoneOffset;

    address otherPlayer;

    function init(
        bytes calldata data
    ) public payable virtual override initializer {
        betAmount = msg.value;

        (
            alarmTime,
            alarmActiveDays,
            betDuration,
            submissionWindow,
            timezoneOffset,
            otherPlayer
        ) = abi.decode(data, (uint, uint8[], uint, uint, uint, address));

        name = IMPLEMENTATION_NAME;
    }

    /**
     * Only party2 can activate the alarm clock schedule
     
    function start() public payable {
        require(msg.value >= betAmount, "INSUFFICIENT_FUNDS_SENT");
        require(msg.sender == otherPlayer, "ONLY_PLAYER_2_CAN_START");

        party1Schedule.initialize(alarmTime, alarmActiveDays);
        party2Schedule.initialize(alarmTime, alarmActiveDays);

        emit CommitmentInitialized("Alarm Bet Started");
    }

    /**
     * Allow either player to 'confirm' a wakeup. Wakeups must be submitted within
     * the submission window for the entry to be recorded
     *
    function submitConfirmation() public payable {}
}

*/
