describe("EnforcementModules", () => {
    describe("Timelock Enforcement Module", async () => {
        describe("Timelock: Joining", () => {
            it("Requires users to stake funds when joining")
            it("Only allows the commitment owner to enter their commitment")
            it("Only allows DeadlineCommitments to be entered")
        })
        describe("Timelock: Penalizing", () => {
            it("Set a user entry to locked if a deadline was missed")
            it("Reverts if the user has not missed any deadlines")
        })
        describe("Timelock: Exiting", () => {
            it("Allows a user to withdraw after ")
        })
    })
})