// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// **** Proof Of Completion Modules **** //

interface ProofModule {
    /** Attrs **
     * proofHistory: timestamp[]
     */

    /** Internal Functions **
     * _recordProof() internal
     */
}

interface ContestableProof is ProofModule {
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

interface Commitment is ProofModule {
    /** Attrs **
     * owner: address
     * pool?: CommitmentPool  
     * proofModule: ProofModule
     * status: active | inactive
     */


    /** External Functions **
     * 
     * submitProof() virtual
     * 
     * missedProofs() virtual
     * 
     * joinPool() onlyOwner
     * 
     * invalidateProof() onlyProofModule
     * 
     */
}

interface ContestableCommitment {
    /* removeProof(proofHistoryIndex)
        * Requires proof to be apart of a pool
        * Only the pool can remove a proof
    */   
}

interface RateableCommitment is Commitment {
    // Rating

    // rate()
    // _calculateRating()
}

interface DeadlineCommitment is Commitment {
    // deadline 

    // missedProofs() override
}

interface DayOfWeekCommitment is Commitment {
    // daysActive 

    // missedProofs() override
}




// **** Commitment Pools **** //

interface CommitmentPool {
    /** Attrs **
     * rewardFund: IRewardFund
     * 
     * nextCommitmentId: number
     * commitmentEntry {
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

