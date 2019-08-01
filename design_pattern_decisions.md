IPFS is used to store the requirement texts, which would be of arbitrary length.  IPFS wouold make the transaction on Ethereum network cost effective.  <br>

The requirements and evidence data fields of the issueBounty and fulfil bounty functions currently accept arbitrary length strings. The more data saved on the Ethereum network the more expensive the transaction.  If users send a very legnthy explanation in their requirements, they would be penalised since their transaction would be more expensive.  There is an adverse incentive so that bounty posters would not make the description specific. <br>

When issuing a bounty or fulfiling one, we can use IPFS, which would return hash of the content that we can use to look up the data. This id or hash is always of fixed length and we would send this to the smart contract for reference instead of the requirements. the length of The requirement input would no longer increase the cost of the issue bounty transaction. <br>

The UI is developed using React since React is modular and each component is independent.  The modularity of React allows us to add more features as desired.  


