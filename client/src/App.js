import React, { Component } from "react";
import BountiesContract from "./contracts/Bounties.json";
import getWeb3 from "./utils/getWeb3";

//import the react-bootstrap components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import "./App.css";

const etherscanBaseUrl = "https://rinkeby.etherscan.io"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      bountiesInstance: undefined,
      bountyAmount: undefined,
      bountyData: undefined,
      bountyDeadline: undefined,
      etherscanLink: "https://rinkeby.etherscan.io",
      bounties: [],
      account: null,
      web3: null
    }

    this.handleIssueBounty = this.handleIssueBounty.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  //componentDidMount() is a react lifecycle method which is called just after the component is mounted 
  //we use this react lifecycle event to initiate our web3 instance by calling getWeb3 and also instantiating our contract instance object. 
  //This ensures our contract instance and web3 objects are ready for when our application renders.
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BountiesContract.networks[networkId];
      const instance = new web3.eth.Contract(
       BountiesContract.abi,
       deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ bountiesInstance: instance, web3: web3, account: accounts[0]})
      this.addEventListener(this)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <Container>
      <Row>
      <a href={this.state.etherscanLink} target="_blank">Last Transaction Details</a>
      </Row>
      <Row>
      <Card>
      <Card.Title>Issue Bounty</Card.Title>
      <Form onSubmit={this.handleIssueBounty}>
          <FormGroup
            controlId="fromCreateBounty"
          >
            <FormControl
              componentClass="textarea"
              name="bountyData"
              value={this.state.bountyData}
              placeholder="Enter bounty details"
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted-1">Enter bounty data</Form.Text><br/>

        <FormControl
              type="text"
              name="bountyDeadline"
              value={this.state.bountyDeadline}
              placeholder="Enter bounty deadline"
              onChange={this.handleChange}
            />
            <Form.Text className="text-muted-1">Enter bounty deadline in seconds since epoch</Form.Text><br/>

        <FormControl
              type="text"
              name="bountyAmount"
              value={this.state.bountyAmount}
              placeholder="Enter bounty amount"
              onChange={this.handleChange}
            />
            <Form.Text>Enter bounty amount</Form.Text><br/>
            <Button type="submit">Issue Bounty</Button>
          </FormGroup>
      </Form>
      </Card>
      </Row>
      </Container>
      </div>
      );
  }

  //the callback handleChange to update our form input data as it is updated by the user
  //This function simply checks which input object was updated, and then updates the value in our component state.
  handleChange(event)
  {
    switch(event.target.name) {
        case "bountyData":
            this.setState({"bountyData": event.target.value})
            break;
        case "bountyDeadline":
            this.setState({"bountyDeadline": event.target.value})
            break;
        case "bountyAmount":
            this.setState({"bountyAmount": event.target.value})
            break;
        default:
            break;
    }
  }

  //the issueBounty callback to handle the event which happens when the user submits the form. 
  //This function should take the current form input values from the component state, 
  //and use the bountiesInstance object to construct and send an issueBounty transaction with the form inputs as arguments.
  async handleIssueBounty(event)
    {
      if (typeof this.state.bountiesInstance !== 'undefined') {
        event.preventDefault();
    let result = await this.state.bountiesInstance.methods.issueBounty(this.state.bountyData,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
        this.setLastTransactionDetails(result)
      }
    }

  //The function setLastTransactionDetails simply take the result of the transaction
  //updates the current etherscan link so the user is able to view the transaction in etherscan:
  setLastTransactionDetails(result)
    {
    if(result.tx !== 'undefined')
    {
      this.setState({etherscanLink: etherscanBaseUrl+"/tx/"+result.tx})
    }
    else
    {
      this.setState({etherscanLink: etherscanBaseUrl})
    }
  }
}

export default App;
