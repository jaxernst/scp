// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library FixedPenaltyDistributor {
    event DepositEmpty();
    struct Vault {
        uint deposit;
        uint penaltyAmount;
    }

    function init(Vault storage self, uint penaltyAmount) internal {
        self.penaltyAmount = penaltyAmount;
    }

    function deposit(Vault storage self, uint amount) internal {
        self.deposit += amount;
    }

    function withdraw(Vault storage self, uint amount) internal {
        require(self.deposit >= amount, "INSUFFICIENT_FUNDS");
        self.deposit -= amount;
    }

    function penalize(Vault storage self) internal returns (uint) {
        if (self.deposit < self.penaltyAmount) {
            uint penaltyVal = self.deposit;
            self.deposit = 0;
            emit DepositEmpty();
            return penaltyVal;
        }
        self.deposit -= self.penaltyAmount;
        return self.penaltyAmount;
    }

    function transferPenalty(
        Vault storage self,
        Vault storage other
    ) internal returns (uint) {
        uint transferAmount = penalize(self);
        other.deposit += transferAmount;
        return transferAmount;
    }
}
