# An Interactive and Social Productivity Protocol

The Social Commitment Protocol is a generalized productivity protocol with an open and extendible architecture allowing for individual goals and 'commitments' to be enforced in a social and game-like manner.

At the core of the protocol is the idea of a "Commitment". A user making a commitment is signing a transaction as an agreement that they will do whatever the commitment describes. The base form of a commitment only has a few simple attributes, but can be extended and customized to allow for all sorts fun and unique functionality that is only achievable through smart contracts.

# Commitment Extension Examples

__ToDo or Die__  
This commitment extension acts as a way to forcefully incentivize yourself to get your goals and ToDo items accomplished. You describe what is is you need to get done, then set a deadline. If you fail to mark it as completed in time, there will be automated penalties. Penalities are customizeable but may include:
* Timelocking your funds in the smart contract
* Automically donating your funds to preset addresses

__Alarm Clock Task Pool__ (in development)  
This commitment extension serves as a way to help individuals force themselves to wake up earlier. When joining the pool, the user selects the following:
* Desired wakeup time
* Days of the week to enforce the alarm
* Any amount of money the user wants to put at stake to force themselves to abide by the alarm
* A description of a task they must complete to confirm they've woken up, which is proveable by taking a picture

Each morning, a user in the pool must submit a URL to the pool, which is simply a link to an externally hosted image of them completing the task. Failing to confirm their wakeup by their alarm time can result in a penalty which is deducted from their stake and sent to the other members of the pool. To prevent re-used images and 'fake' proofs, users can vote on the legitimacy of others' proofs. A successfully contested proof can result in a user losing a portion of their stake to the pool.

__Commitment Bets__  (in development)  
A commitment bet is made between two users, who must both put up the same amount of money and provide a written description of the task they must complete, or conditions that must be met for their side of the deal to be held up. Both parties must submit their proof of completion to the bet contract before the deadline, else their funds may be sent to the other party. If both proofs are submitted on time, but the parties do not sign off on the outcome of the bet, the bet can be taken to a [public decentralized court](https://court.aragon.org/#/dashboard) for resolution.

## Development

This project is setup as a monorepo including the generalized protocol under the "protocol" package, and a web app interface under the "interfaces" package.

This is a very young project, and the protocol + APIs are rapdily evolving.

## Build and Test the protocol
This repo uses yarn package manager, and will not work with yarn v1

* Ensure the correct version of yarn is being used:
```
yarn set version berry
```

* Install dependencies:
```
yarn install
```

* Compile smart contracts and test
```
yarn test-protocol
```


# Contribution

This is an open source project and I welcome anyone who would like to contribute. For more information about the project and/or the devlopment work being done, feel free to message me on telegram @jaxernst. 

