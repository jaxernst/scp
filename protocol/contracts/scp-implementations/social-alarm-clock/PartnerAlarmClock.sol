// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../BaseCommitment.sol";
import "../../schedule-modules/AlarmSchedule.sol";
import "../../penalty-modules/FixedPenaltyDistributor.sol";
import {ICommitmentHub} from "../../interfaces/ICommitmentHub.sol";

/**
 * The partner alarm clock is a commitment contract that allows two people to set an 'alarm'
 * together, which represents an agreement for both parties to wake up at the same time on the
 * designated days. To verify that each party has woken up, they simply need to submit a
 * confirmation transaction before the alarm time. Failure to do so can result in a penalty
 * that will transfer funds to the other party.
 */
contract PartnerAlarmClock is BaseCommitment {
    string constant IMPLEMENTATION_NAME = "Partner Alarm Clock";
    ICommitmentHub deploymentHub;

    using AlarmSchedule for AlarmSchedule.Schedule;

    struct Player {
        AlarmSchedule.Schedule schedule;
        uint depositAmount;
    }

    mapping(address => Player) players;

    uint public alarmTime;
    uint8[] public alarmActiveDays;
    uint public submissionWindow;
    int public timezoneOffset;
    uint public betAmount;
    address public player1;
    address public player2;
    uint public missedAlarmPenalty;

    function init(
        bytes calldata data
    ) public payable virtual override initializer {
        require(msg.value > 0, "BET_VALUE_REQUIRED");
        deploymentHub = ICommitmentHub(msg.sender);

        // Initialize to an inactive state, commitment becomes activated once player 2 starts
        status = CommitmentStatus.INACTIVE;
        name = IMPLEMENTATION_NAME;
        betAmount = msg.value;
        player1 = tx.origin;

        (
            alarmTime,
            alarmActiveDays,
            missedAlarmPenalty,
            submissionWindow,
            timezoneOffset,
            player2
        ) = abi.decode(data, (uint, uint8[], uint, uint, int, address));

        players[player1].depositAmount = msg.value;
        players[player1].schedule = AlarmSchedule.init(
            alarmTime,
            alarmActiveDays,
            submissionWindow,
            timezoneOffset
        );

        players[player2].schedule = AlarmSchedule.init(
            alarmTime,
            alarmActiveDays,
            submissionWindow,
            timezoneOffset
        );
    }

    modifier onlyPlayer() {
        require(
            msg.sender == player1 || msg.sender == player2,
            "ONLY_PLAYER_ACTION"
        );
        _;
    }

    /**
     * Only player2 can start the alarm
     */
    function start() public payable {
        require(status == CommitmentStatus.INACTIVE, "ALREADY_STARTED");
        require(msg.value >= betAmount, "INSUFFICIENT_FUNDS_SENT");
        require(msg.sender == player2, "ONLY_PLAYER_2_CAN_START");

        players[player1].schedule.start();
        players[player2].schedule.start();
        players[player2].depositAmount += msg.value;

        deploymentHub.emitUserJoined(
            RegisteredCommitmentType.PARTNER_ALARM_CLOCK,
            player2
        );

        status = CommitmentStatus.ACTIVE;
        emit CommitmentInitialized("Alarm Bet Started");
    }

    /**
     * Allow either player to 'confirm' a wakeup. Wakeups must be submitted within
     * the submission window on an alarm day for the entry to be recorded
     */
    function submitConfirmation() public override onlyPlayer {
        players[msg.sender].schedule.recordEntry();
        emit ConfirmationSubmitted();
    }

    function missedDeadlines(address player) public view returns (uint) {
        return players[player].schedule.missedDeadlines();
    }

    function numConfirmations(address player) public view returns (uint) {
        return players[player].schedule.entries();
    }

    function timeToNextDeadline(address player) public view returns (uint) {
        return players[player].schedule.timeToNextDeadline();
    }

    function alarmDays() public view returns (uint8[] memory) {
        return alarmActiveDays;
    }

    // When a player withdraws, their total penalty is calculated based of their missed deadlines,
    // and the penalty is added to the other player's deposit
    function withdraw() public onlyPlayer {
        address otherPlayer = msg.sender == player1 ? player2 : player1;

        uint penaltyAmount = getPenaltyAmount(msg.sender);

        // Subtract the penalty amount from the player's deposit
        players[msg.sender].depositAmount -= penaltyAmount;
        // Add on the penalty amount to the other player's deposit
        players[otherPlayer].depositAmount += penaltyAmount;

        uint withdrawAmount = players[msg.sender].depositAmount;
        players[msg.sender].depositAmount = 0;
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getPlayerBalance(address player) public view returns (uint) {
        return players[player].depositAmount - getPenaltyAmount(player);
    }

    function getPenaltyAmount(address player) public view returns (uint) {
        uint numMissedDeadlines = players[player].schedule.missedDeadlines();
        uint penaltyVal = numMissedDeadlines * missedAlarmPenalty;
        if (penaltyVal > players[player].depositAmount) {
            return players[player].depositAmount;
        }
        return penaltyVal;
    }
}
