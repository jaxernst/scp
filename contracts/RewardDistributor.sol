pragma solidity ^0.8.0;

interface IAlarmPoolRewardDistributor {
    function deposit() external;
    function withdrawl() external;
}

contract AlarmPoolRewardDistributor {
    mapping(address => uint) userReward;
}