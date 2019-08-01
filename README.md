# consensys_final_project
This is a simple bounty market Dapp. 
-A job poster can create a new bounty and set a bounty descriptionm include the amount to be paid for a successful submission. 
-A bounty hunter is able to view a list of posted bounties. B
-A bounty hunter can submit work to a bounty for review.

- Screen recording link:https://youtu.be/tx9yacRwkUc 
- Deployed contract is live on Rinkeby test net.  Link to one of the transactions: https://rinkeby.etherscan.io/tx/0xa18b8db74be480b49b96b432f7685ff7ebbfebfc172c5c95e312f87db0756d3d


## To run Dapp on local server 
First, cd into "/client" subdirectory
Second, run $ npm install
Third, run $ npm run start"


## Test

Seven tests are created for the "Bounties.sol" contract.  Below pleaes see the snapshot of test resutls from Truffle.

Compiling your contracts...
===========================
> Compiling ./contracts/Bounties.sol
> Artifacts written to /var/folders/tz/kppvy5gn7nl1yp3dg7hxnbnw0000gn/T/test-119631-12025-9qxuyt.7f1qd
> Compiled successfully using:
   - solc: 0.5.8+commit.23d335f2.Emscripten.clang



  Contract: Bounties
    ✓ Should allow a user to issue a new bounty (88ms)
    ✓ Should return an integer when calling issueBounty (44ms)
    ✓ Should not allow a user to issue a bounty without sending ETH
    ✓ Should not allow a user to issue a bounty when sending value of 0
    ✓ Should not allow a user to issue a bounty with a deadline in the past
    ✓ Should not allow a user to issue a bounty with a deadline of now
    ✓ Should not allow a user to fulfil an existing bounty where the deadline has passed (82ms)


  7 passing (1s)
  
  
## Design Pattern Requirements:
The contract is designed to achieve a well balanced mix of simplicity and security. 
IPFS to store the requirements text to make transaction cost-effective on the Etherem network. 

## Security Tools / Common Attacks
Contract is analyzed on Remix for security strength.  Reantrance and integer overflow/underflow are the aforemost concerned in security analysis. SafeMath is being used in the contract.


