
describe("Alarm Pool Unit Tests", () => {
    it('The factory collects a percentage fee when a user joins the pool')
    it('Alarm penalities can not be enforced on paused user alarms')
    it('User wakeup counts are reset when')
    it("User alarm structs are deleted when exiting a pool")
    
    // Multi test case tests
    it(`_dayOfWeek returns {day} for timestamp {timestamp}`) 
    it('Missed wakeup accounting')
})

describe("Alarm pool time based tests", () => {
    it('_now() returns the UTC blockhain time adjusted for the timezone offet')
    it('Enforces wakeups based of the alarm pool timezone')
    it('Prevents wakeups from being submitted outside the wakeup window')
})

describe("Security", () => {
    it("Any user alarm activation time is returned as 0 before user joins")
    it("Any user alarm activation time is 0 after exits")
    it("Disallows alarm day arrays with 0 length")
    it("Disallows alarm day arrays with length greater than 7")
    it("Disallows alarm day arrays with values outside the range [1,7]")
    it("Rewards claim function protects against rentrancy attacks")
})

describe("Rewards Accounting"), () => {
    it('Users cannot claim rewards until 20 wakeups have been accounted for')
    it('An elligble user can claim 100% of the reward fund as the sole participant')
    it('An elligible user can claim 50% of the reward fund with two participants staking equal amounts')
}