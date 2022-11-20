# Overview

The Social Commitment Protocol is a smart contract protocol that allows individuals to come together, build better habits in a social manner, and optionally put their money at stake in order to incentivize high achievement. 

At the core of the protocol is the idea of a "Commitment". A user's commitment is represented by an ownable smart contract that has a few simple traits, but  is heavily customizeable to include more interactive logic. A simple commitment contract may be a simple description of a ToDo task signed and owned by one user while being visible to other users, but these contracts can become much more interactive. Below are some examples of more complex commitment extensions:

__Alarm Clock Task Pool__ (in development)  
This commitment extension serves as a way to help individuals force themselves to wake up earlier. When joining the pool, the user selects the following:
* Desired wakeup time
* Day of the week to enforce the alarm
* Any amount of money the user wants to put at stake to force themselves to abide by the alarm
* A description of a task they must complete to confirm they've woken up, which is proveable by taking a picture

Each morning, a user in the pool must submit a URL to the pool, which is simply a link to an externally hosted image of them completing the task. Failing to confirm their wakeup by their alarm time can result in a penalty which is deducted from their stake and sent to the other members of the pool. To prevent re-used images and 'fake' proofs, users can vote on the legitimacy of others' proofs. A successfully contested proof can result in a user losing a portion of their stake to the pool.

__Commitment Bets__  (in development)  
A commitment bet is made between two users, who must both put up the same amount of money and provide a written description of the task they must complete, or conditions that must be met for their side of the deal to be held up. Both parties must submit their proof of completion to the bet contract before the deadline, else their funds may be sent to the other party. If both proofs are submitted on time, but the parties do not sign off on the outcome of the bet, the bet can be taken to a [public decentralized court](https://court.aragon.org/#/dashboard) for resolution.

### Development

This project is setup as a monorepo including the generalized protocol under the "protocol" package, and a web app interface under the "interfaces" package.

This is a very young project, so many details here may be outdated.

## Setup frontend and test smart contracts

*** Warning: The frontend will not currently run due to protocol refactoring ***

This repo uses yarn package manager. With yarn installed run the following:

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

* Run the frontend/interface
```
yarn start-interface
```

# Contribution

This is an open source project and I welcome anyone who would like to contribute. For more information about the project and/or the devlopment work being done, feel free to message me on telegram @jaxernst. 

