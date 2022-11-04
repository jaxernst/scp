// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;



interface Contestable {
    /** Attrs **
     * revokedProofs
     * 
     * CONTESTMENT_DURATION = 3 days
     * MINIMUM_VOTES = 5
     * 
     * contestment {
     *  deadline,
     *  proofHistoryIndex,
     *  votesToKeep,
     *  votesToRevoke
     * }
     * 
     * activeContestments: contestment[]
     * proofContestmentActive: map proofHistoryIndex => bool
     */

    /**  Events **
     * ProofSubmitted(uri, timestamp)
     * ProofRevoked(timestamp) 
     * ContestmentCreated(timestamp)
     */

    /** External Functions **
     * contestProof(proofHistoryIndex) public {
     *   - Require: proofContestmenActive[proofHistoryIned] = false
     *   - Adds new contestment to end of activeContestments array
     * }
     * 
     * voteOnContestment() public {}
     * finalizeContestment() public {}
     * 
     */
}


// **** Commitments **** //

interface Commitment {
    /** Attrs **
     * owner: address
     * pool?: CommitmentPool  
     * status: active | inactive | complete
     * submissions: number
     */

    /** Events **
     * ProofSubmitted(uri)
     */

    /** External Functions **
     * submitProof() virtual
     * joinPool() onlyOwner
     * endCommitment() onlyOwner
     */
}


interface DeadlineCommitment is Commitment {
    /** Attrs **
     * deadline: timestamp
     * submissionWindow: number
     */ 

    /** External Functions **
     * submitProof() override onlyOwner
     *  - Require: submissions = 0
        - Require: in submission window
     *  - State changes:
     *      submissions++
     *      status = complete
     *
     * missedProofs() override
     */
}

interface DayOfWeekCommitment is Commitment, Contestable {
    /** Attrs **
     * daysActive: number[] (max length 7) 
     * submissionArray: number[] (length 7)
     * */ 

    // missedProofs() override
}

interface RateableCommitment is DeadlineCommitment | DayOfWeekCommitment {
    /** Attrs **
     * totalRating: number
     * commitmentRigor: number (1-10)
     * scheduleRigor: number (1-10)
     * proveability: number (1-10)
     */ 

    /** Events **
     * Rated(totalRating, commitmentRigor, scheduleRigor, proveability)
     */

    /** External Functions **
     * rate(scheuleRigor, commitmentRigor, proveability)
     */ 
}



// **** Commitment Pools **** //

interface CommitmentPool {
    /** Attrs **
     * rewardFund: IRewardFund
     * 
     * nextCommitmentId: number
     * userCommitment {
     *  commitment: address,
     *  valueStaked: number,
     *  numPenalties: number 
     * }
     * 
     * commitmentEntries: map number (id) => ICommitment
     * commitmentIds: map address => number (id)
    
    /** External Functions **
     * joinPool() payable
     * exitPool()
     * penalize(commitmentId)
     */
}



// **** Reward Fund **** //

interface RewardFund {
    /** Attrs **
     * commitmentPoolId
     */

    /** External Functions **
     * deposit() external payable
     * claim(commitment) virtual
    */
}

interface CommitmentRatingRewardFund {
    // claim()
}

