
The contract is first developted on Remix.  It is analyzed on Remix for security vulnerabilites, which have been addressed. 

The integer overflow/underflow is the aforemost concerned since the deadline is entered as seconds since last epoch. SafeMath is being used in the contract to prevent overflow when working with unit.
