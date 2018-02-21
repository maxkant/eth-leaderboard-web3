import React, {Component} from 'react';
import {default as Web3} from 'web3';

class LeaderBoard extends Component{

  constructor(props){
    super(props);
    // Get Web3, currently only works with testrpc running on localhost:8545, need to add metamask, ropsten etc...
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    this.state = {
      web3: web3,
      addressToMatch: null,
      tempAddress: null,
      allTransactions: [],
      matchedTransactions: [],
      accounts: [],
    };
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  async getAllTransactions(nBlocksToSearch){
    this.setState({allTransactions: []});
    const web3 = this.state.web3;
    // get most recent block number
    const blockNumber = await web3.eth.getBlockNumber();
    // initialize array to hold transactions
    var allTransactions = [];
    // calculate initial block number, set to 0 if the number of blocks to search is greater than the total number of blocks (shouldn't happen on the main net)
    var startBlock = (blockNumber >= nBlocksToSearch) ? (blockNumber - nBlocksToSearch) : 0;
    // loop over all blocks and grab transactions
    for (let i = startBlock; i < blockNumber; i++){
      const block = await web3.eth.getBlock(i);
      const nTransactions = await web3.eth.getBlockTransactionCount(i);
      const blockTransactions = block.transactions;
      for (let j = 0; j < nTransactions; j++){
        const tx = blockTransactions[j];
        //get transactions details from hash
        const rawTX = await web3.eth.getTransaction(tx);
        allTransactions = allTransactions.concat([rawTX]);
      }
      this.setState({
        allTransactions: allTransactions,
      });
    }
  }

  getMatchingTransactions(addressToMatch) {
      //clear matchedTransactions
      this.setState({matchedTransactions: [],});
      var matchedTX = [];
      // for each transaction check if the recipient matches our search address
      const allTransactions = this.state.allTransactions;
      for (let i = 0; i < allTransactions.length; i++){
        const tx = allTransactions[i];
        if (tx.to === addressToMatch){
          matchedTX = matchedTX.concat([tx]);
        }
      }
      this.setState({
        matchedTransactions: matchedTX,
      });
  }
  async getAccounts(){
    var accounts = [];
    accounts = await this.state.web3.eth.getAccounts();
    this.setState({accounts: accounts,});
  }
  componentDidMount(){
    this.getAccounts();
    this.getAllTransactions();
  }

  handleSearchChange(event){
    this.setState({
      tempAddress: event.target.value,
    });
  }

  handleSearchSubmit(event){
    event.preventDefault();
    const tempAddress = this.state.tempAddress;
    this.setState({
      addressToMatch: tempAddress,
    })
    this.getMatchingTransactions(tempAddress);
    // checkValidity
  }
  renderSearch(){
    return(
      <form onSubmit = {this.handleSearchSubmit}>
        <label>
          Search for transactions to an account:
          <input className = "input"
            name = "address"
            type = "string"
            value = {this.state.adress}
            onChange = {this.handleSearchChange}/>
          <button> do it</button>
        </label>
      </form>
    );
  }
  renderAccountList(){
    return(
      <div>
        <h6> Available accounts: </h6>
        {this.state.accounts.map((account) => {
          return(
            <h6>{account}</h6>
          )
        })}
      </div>
    );
  }
  renderLeaderBoard(){
    return(
      <table className = "LeaderBoard">
        <tr>
          <th>#</th>
          <th>From</th>
          <th>Value (wei)</th>
        </tr>
        {this.state.matchedTransactions.map((tx, idx) => {
          return(
            <tr>
              <th>{idx + 1}</th>
              <th>{tx.from}</th>
              <th>{tx.value}</th>
            </tr>
          )
        })}
      </table>
    );
  }
  render(){
    return(
      <div className = "main-container">
        <h1> You made it! </h1>
        {this.renderSearch()}
        <div className = "flex-container">
          <div className = "left">
            {this.renderAccountList()}
          </div>
          <div className = "right">
          {this.state.addressToMatch? (this.renderLeaderBoard()) : ('Enter an address!')}
          </div>
        </div>
      </div>
    );
  }
}

export default LeaderBoard;
