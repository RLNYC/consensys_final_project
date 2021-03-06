import React, { Component } from "react";
import BountiesContract from "./contracts/Bounties.json";
import getWeb3 from "./utils/getWeb3";
import { setJSON, getJSON } from './utils/IPFS.js'

//import the react-bootstrap components
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';

import "./App.css";
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const etherscanBaseUrl = "https://rinkeby.etherscan.io";
const ipfsBaseUrl = "https://ipfs.infura.io/ipfs";

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

  addEventListener(component) {

    this.state.bountiesInstance.events.BountyIssued({fromBlock: 0, toBlock: 'latest'})
    .on('data', async function(event){
      //First get the data from ipfs and add it to the event
      var ipfsJson = {}
      try{
        ipfsJson = await getJSON(event.returnValues.data);
      }
      catch(e)
      {

      }

      if(ipfsJson.bountyData !== undefined)
      {
        event.returnValues['bountyData'] = ipfsJson.bountyData;
        event.returnValues['ipfsData'] = ipfsBaseUrl+"/"+event.returnValues.data;
      }
      else {
        event.returnValues['ipfsData'] = "none";
        event.returnValues['bountyData'] = event.returnValues['data'];
      }

      var newBountiesArray = component.state.bounties.slice()
      newBountiesArray.push(event.returnValues)
      component.setState({ bounties: newBountiesArray })
    })
    .on('error', console.error);
  }

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
      <Row>
      <Card>
      <Card.Title>Issued Bounties</Card.Title>
      <BootstrapTable data={this.state.bounties} striped hover>
        <TableHeaderColumn isKey dataField='bounty_id'>ID</TableHeaderColumn>
        <TableHeaderColumn dataField='issuer'>Issuer</TableHeaderColumn>
        <TableHeaderColumn dataField='amount'>Amount</TableHeaderColumn>
        <TableHeaderColumn dataField='ipfsData'>Bounty Data</TableHeaderColumn>
        <TableHeaderColumn dataField='data'>Bounty Data</TableHeaderColumn>
      </BootstrapTable>
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
        const ipfsHash = await setJSON({ bountyData: this.state.bountyData });
        let result = await this.state.bountiesInstance.methods.issueBounty(ipfsHash,this.state.bountyDeadline).send({from: this.state.account, value: this.state.web3.utils.toWei(this.state.bountyAmount, 'ether')})
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
