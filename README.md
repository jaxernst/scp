# A Generalized Protocol for Facilitating Interactive, Public Commitments

![](https://img.shields.io/github/stars/jaxernst/the-social-commitment-protocol?style=for-the-badge&labelColor=d0ab23&color=b0901e&logoColor=white&logo=Trustpilot)
[![](https://dcbadge.vercel.app/api/server/MJHxzqDGuv)](https://discord.gg/MJHxzqDGuv)
![](https://img.shields.io/badge/License-Apache--2.0-orange.svg?style=for-the-badge&labelColor=EF9421&logoColor=white&logo=CreativeCommons)

<br>

The Social Commitment Protocol (SCP) is a smart contract protocol built to facilitate and enforce commitments made by individuals and organizations. A commitment, as defined, is an agreement or pledge to do something in the future. The Social Commitment Protocol allows for programmatic creation, enforcement, and customization of any and all forms of commitments.

At the core of the protocol is the Commitment primitive. Commitments are standalone smart contracts (ownable by one or many accounts) that host both the information pertaining to the commitment and the functionality to interact with the commitment. Commitments come with configurable modules for scheduling, penalizing, rewarding, and determining the validity of commitment 'confirmations'. Confirmations can be simple calls from external contracts to validate on-chain actions, or can be user submitted URIs to external proofs (receipts, screenshots, photos, etc.). Modules are designed to compose together, so new forms of commitments can be created with trustless accountability.

# What's possible with the protocol?
There are many ways to implement commitments and build apps on of the protocol, but I have compiled some of my favorites:

- Task and Todo tracking apps that allow users to put down ‘collateral’ on their commitments and incentivize themselves to be more productive.
- Social apps that allow goals and commitments to be shared with friends, with credit systems in place to reward users for high achievement and proving to the protocol that commitments have been completed
- DAO governance participation enforcement systems
- Public accountability systems for public-figures or organizations to officiate their commitments/promises


# The SCP Monorepo
This repo contains the protocol source code (written in Solidity), an SDK to support dApp development, and a "dapps" directory, which are frontends built on top of the SCP.

# Architecture
### Minimal Proxy Commitments
Commitments are independent, ownable smart contracts. Deploying new bytecode for each commitment is impractical and expensive, so commitments are created as minimal proxies, or clones (see [EIP-1167](https://eips.ethereum.org/EIPS/eip-1167)). Commitments are created through the CommitmentHub from pre-registered contract templates. This drastically reduces the gas cost of deploying a new commitment, and allows new commitment types to be registered through the CommitmentHub. (Registration may eventually be approved through governance).

## Base Commitment
```solidity
interface ICommitment {
    event CommitmentInitialized(string description);
    event ConfirmationSubmitted();
    event ProofSubmitted(string uri, uint proofId);
    event StatusChanged(Status from, Status to);
    
    function status() external view returns(Status);
    function name() external view returns(string memory);
    function owner() external view returns(address);
    function submitConfirmationWithProof(string memory) external;
    function submitConfirmation() external;
    function pause() external;
    function resume() external;
    function terminate() external;
}
  ```
A base commitment acts as a minimal structure for creating and updating the state of your commitments. The Commitment provides functionality to confirm completion of your commitment, and optionally submit an external link as a proof of completion.



## Scheduled Commitments
```solidity
interface ISchedule {
    event DeadlineMissed();
    function scheduleType() external view returns(ScheduleType);
    function submissionWindow() external view returns(uint);
    function inSubmissionWindow() external view returns(bool);
    function missedDeadlines() external view returns(uint);
    function nextDeadline() external view returns(uint);
}

interface IDeadlineSchedule is ISchedule {
    function deadline() external view returns(uint);
}

interface IAlarmSchedule is ISchedule {
    function activeDays() external view returns(uint8[] memory);
    function alarmTime() external view returns(uint);
}

interface IScheduledCommitment is ISchedule, ICommitment {}
interface IDeadlineCommitment is IDeadlineSchedule, ICommitment {}
interface IAlarmCommitment is IAlarmSchedule, ICommitment {}
```
Commitments can be extended with scheduling logic that only allows submissions to occur within 'submission windows'. Schedule modules also track 'missedDeadlines' which can be read by enforcement modules to penalize and/or reward commitments.

## Enforcement Modules
```solidity
interface IEnforcementModule {
    event UserJoined(uint id);
    event UserExit(uint id);
    
    function join(IScheduledCommitment commitment, bytes calldata joinData) external payable;
    function penalize(address user) external;
    function exit() external;
}
```
Enforcement modules are a core component of the protocol that facilitate commitment interactivity. Custom enforcement modules can be created to facilitate pooled commitments with reward structures and penalization logic. This may include logic for pool members to vote on each other's 'proof of completion', logic to time-lock funds if deadlines are missed, and can if implement achievement 'credit' systems where users get more reputation for posting commitments and successfully completing them. The possibilities here are endless.

## Composed Commitment Extension Examples

__ToDo or Die__  
This commitment extension acts as a way to forcefully incentivize yourself to get your goals and ToDo items accomplished. You describe what it is you need to get done, then set a deadline. If you fail to mark it as completed in time, there will be automated penalties. Penalties are customizable but may include:
* Timelocking your funds in the smart contract
* Automatically donating your funds to preset addresses

__Alarm Clock Task Pool__ (in development)  
This commitment extension serves as a way to help individuals force themselves to wake up earlier. When joining the pool, the user selects the following:
* Desired wakeup time
* Days of the week to enforce the alarm
* Any amount of money the user wants to put at stake to force themselves to abide by the alarm
* A description of a task they must complete to confirm they've woken up, which is provable by taking a picture

Each morning, a user in the pool must submit a URL to the pool, which is simply a link to an externally hosted image of them completing the task. Failing to confirm their wakeup by their alarm time can result in a penalty which is deducted from their stake and sent to the other members of the pool. To prevent re-used images and 'fake' proofs, users can vote on the legitimacy of others' proofs. A successfully contested proof can result in a user losing a portion of their stake to the pool.

__Commitment Bets__  (in development)  
A commitment bet is made between two users, who must both put up the same amount of money and provide a written description of the task they must complete, or conditions that must be met for their side of the deal to be held up. Both parties must submit their proof of completion to the bet contract before the deadline, else their funds may be sent to the other party. If both proofs are submitted on time, but the parties do not sign off on the outcome of the bet, the bet can be taken to a [public decentralized court](https://court.aragon.org/#/dashboard) for resolution.

# Setup
This repo uses the yarn package manager, and will not work with yarn v1

* Ensure the correct version of yarn is being used:
```
yarn set version berry
```

* Install dependencies:
```
yarn install
```

## Build and Test the protocol

* Compile smart contracts and test
```
yarn test-protocol
```

## Development

This project is setup as a monorepo including the generalized protocol under the "protocol" package, and a web app interface under the "interfaces" package.

This is a very young project in active development, and the protocol + APIs are rapidly evolving.


# Contribution

This is an open source project and I welcome anyone who would like to contribute. For more information about the project and/or the development work being done, feel free to message me on telegram @jaxernst. 

