# Overview

The Social Alarm Clock is a smart contract protocol that allows individuals to come together, put their money at stake, and ultimately built morning habits.

The core component to the Social Alarm Clock is an Alarm Clock Pool, which is a smart contract consisting of 2 or more users that all agree to wakeup at the same time. When joing (or creating) a pool, a user chooses how much to put at stake, what days to enforce the alarm, and what the penatly (or fee) is for missing a wakeup.

After joining a pool, any user who misses their alarm loses a portion of their stake, and that portion gets distributed to the other users in the pool.

The idea of this project is to allow individuals to help eachother built better morning habits in a game-like social enviroment. This repository contains the protocol source code along with an open source interface.

### Development

This is a very young project and is not my any means complete. Currently, the minimal viable product version of the AlarmPool is done, but not thoroughly tested, so do not use and/or deploy these contracts unless you know what your doing.

## Setup frontend and test smart contracts

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



# Protocol Full Pitch:

## The Social Alarm Clock - Built Better Morning Habits

Waking up is hard, but socio-financial accountability might just be the best way to help yourself get out of bed in the morning. The Social Alarm Clock uses the power of group accountability to reward individuals who abide by their commitment, and penalize those that fail to wake up on time.

The Social Alarm Clock enables contracts to be made between individuals who struggle to wake up early enough and are willing to put their money at stake to fix their bad habit. The contracts are made between pools of users who agree to their desired wake-up times on the days they choose, and each user must prove to the pool that they got up and out of bed, else users will incur a penalty that gets paid out to the other users in the pool.

### Alarm Pools 

An alarm pool is a pool of funds staked by any number of users who join the pool. A pool has a set alarm wake-up time that users must submit their wake up verification before. New pools can be create and customized with varying penalties, max participants, minimum stake amount, etc. Wake-up verifications are socially-verifiable optimistic proofs that can only be submitted to the blockchain within a certain time period around the pool’s wake up time. Any user who fails to verify their wake-up on their selected days will incur a penalty, which gets distributed among the other users in a pool.

### Interacting with Pools
Users can freely enter and exit any deployed alarm pool as they please. This means you can turn off your alarm clock if you don’t want to wake up early the next day. The only thing you can’t do is exit a pool the morning of your wake-up. (No snooze button)

 To join a pool, you must choose the following:
How much native blockchain currency to put at stake (Penalties are a percentage of funds staked)
What days of the week to enforce it
Wake-up verification task description 

### Social Wake Up Verifications 

The key to the wake up system is that each user has to write, in plain English, how they want their wake-up to be verified (wake-up verification task description). Somebody who really wants to get themselves going in the morning might post their wake-up verification task as “run two miles”. 

In order to prove to the pool that you have done this each morning, you must submit photographic proof. The proof may be a screenshot, or any picture that a group of people would likely consider sufficiently proved. For the running example, a sufficient proof would likely be a screenshot from a fitness app showing your run.

Another key to the wake-up system is that verifications are optimistically assumed to be valid. As long as the user submits a verification, they will not incur the penalty unless their proof is contested by another pool member. 

Most users verifying their morning wake-up tasks will be genuine, and we can assume that the task they submitted on time is valid.  In order to keep users honest, any pool user can challenge previous proofs, and will be rewarded if the challenge is won. Challenging a proof brings the submitted picture to an open floor vote, where all the pool users can vote if the submitted picture matches the wake-up task description that was provided by the target user.

### Game Theory / Pool Economics

In order to incentivize honesty in the alarm pools, protocol mechanics and reward structures must be designed carefully. 

* Problem: Users will financially benefit when one of their fellow pool members fails to sufficiently prove they completed their wakeup task, which will create incentives to contest and vote against their proofs.

  Solution: Users are forbidden from voting on contestments within their own pool.

* Problem: Contestments with small voter turnout are at risk of voter collusion. I.E. If a pool member contests another member, the pool member can convince a few friends to vote in their favor and dishonestly sway the vote.

	Solution: Minimum voter turnout requirements are set for contestment votes. This reduces the viability and increases the difficulty of collusion. 

* Problem: Lack of incentives to vote on wake up proof contestments. 

	Solution: Funds are staked with the blockchain’s native currency, and penalties are paid out in that currency, but contestment voters will be rewarded in a protocol specific token (SAC Token) in order to bootstrap participation in voting. SAC tokens must be acquired to enter Alarm Pools, and even minimal SAC token value will sufficient to incentivize voter turnout

* Problem: Users who successfully contest wake up proofs must be rewarded in order to incentivize searching for dishonest proofs, which may cause searchers to over contest.

	Solution: Any user who contests a wake-up proof will incur a penalty if the vote does not go through. This makes it very unprofitable to contest all the wake-up proofs that are submitted within a pool.
 
