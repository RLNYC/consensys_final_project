const Bounties = artifacts.require("./Bounties.sol");

const getCurrentTime = require('./utils/time.js').getCurrentTime;
const assertRevert = require('./utils/assertRevert.js').assertRevert;
const dayInSeconds = 86400;
const increaseTimeInSeconds = require('./utils/time').increaseTimeInSeconds;


contract('Bounties', function(accounts) {

    let bountiesInstance;
  
    beforeEach(async () => {
        bountiesInstance = await Bounties.new()
     })
     
        /**  happy path: Issuing a bounty should emit a BountyIssued event
    happy path: Calling issueBounty should return an integer
    payable keyword: Issuing a bounty without sending a value should fail
    hasValue modifier: Issuing a bounty with a value of 0 should fail
    validateDeadline modifier: Issuing a bounty with a deadline not greater than now should fail
    */

    it("Should allow a user to issue a new bounty", async () => {
        let time = await getCurrentTime()
        let tx = await bountiesInstance.issueBounty("data",
                                    time + (dayInSeconds * 2),
                                    {from: accounts[0], value: 500000000000});
    
        assert.strictEqual(tx.receipt.logs.length, 1, "issueBounty() call did not log 1 event");
        assert.strictEqual(tx.logs.length, 1, "issueBounty() call did not log 1 event");
        const logBountyIssued = tx.logs[0];
        assert.strictEqual(logBountyIssued.event, "BountyIssued", "issueBounty() call did not log event BountyIssued");
        assert.strictEqual(logBountyIssued.args.bounty_id.toNumber(),0, "BountyIssued event logged did not have expected bounty_Id");
        assert.strictEqual(logBountyIssued.args.issuer, accounts[0], "BountyIssued event logged did not have expected issuer");
        assert.strictEqual(logBountyIssued.args.amount.toNumber(),500000000000, "BountyIssued event logged did not have expected amount");
    
    });


    /**Our second happy path which tests making a call to issueBounty rather than sending a transaction */
    it("Should return an integer when calling issueBounty", async () => {
        let time = await getCurrentTime()
        let result = await bountiesInstance.issueBounty.call("data",
                                    time + (dayInSeconds * 2),
                                    {from: accounts[0], value: 500000000000});
    
        assert.strictEqual(result.toNumber(), 0, "issueBounty() call did not return correct id");
    });


    //test our payable keyword, we invoke a transaction without a value being set:
    it("Should not allow a user to issue a bounty without sending ETH", async () => {
        let time = await getCurrentTime()
        assertRevert(bountiesInstance.issueBounty("data",
                                    time + (dayInSeconds * 2),
                                    {from: accounts[0]}), "Bounty issued without sending ETH");

    });

    //test our hasValue() modifier, we invoke our transaction with a value of 0:
    it("Should not allow a user to issue a bounty when sending value of 0", async () => {
        let time = await getCurrentTime()
        assertRevert(bountiesInstance.issueBounty("data",
                                    time + (dayInSeconds * 2),
                                    {from: accounts[0], value: 0}), "Bounty issued when sending value of 0");

    });

    //test our validateDeadline modifier, we need to send two transactions, one with a deadline set in the past, and another with a deadline set as now:
    it("Should not allow a user to issue a bounty with a deadline in the past", async () => {
        let time = await getCurrentTime()
        assertRevert(bountiesInstance.issueBounty("data",
                                    time - 1,
                                    {from: accounts[0], value: 0}), "Bounty issued with deadline in the past");

    });

    it("Should not allow a user to issue a bounty with a deadline of now", async () => {
        let time = await getCurrentTime()
        assertRevert(bountiesInstance.issueBounty("data",
                                    time,
                                    {from: accounts[0], value: 0}), "Bounty issued with deadline of now");
        });


    //tests is to check that a fulfilment should not be accepted if the deadline has passed
    it("Should not allow a user to fulfil an existing bounty where the deadline has passed", async () => {
        let time = await getCurrentTime()
        await bountiesInstance.issueBounty("data",
                        time+ (dayInSeconds * 2),
                        {from: accounts[0], value: 500000000000});
    
        await increaseTimeInSeconds((dayInSeconds * 2)+1)
    
        assertRevert(bountiesInstance.fulfillBounty(0,"data",{from: accounts[1]}), "Fulfillment accepted when deadline has passed");
 
    });
});






