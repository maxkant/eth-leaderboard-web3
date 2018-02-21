import React, {Component} from 'react';
import {default as Web3} from 'web3';

class LeaderBoard extends Component{

  constructor(props){
    super(props);
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaultAccount = web3.eth.accounts[0];
    this.state = {
      address: '0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e',
      web3: web3,
      matchedTX: [],
    };
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }
  async getTX(){
    this.setState({matchedTX: []});
    const web3 = this.state.web3;
    const blockNumber = await web3.eth.getBlockNumber();
    for (let i = 0; i < blockNumber; i++){
      const block = await web3.eth.getBlock(i);
      const nTX = await web3.eth.getBlockTransactionCount(i);
      const txs = block.transactions;
      for (let j = 0; j < nTX; j++){
        const tx = txs[j];
        const rawTX = await web3.eth.getTransaction(tx);
        if ((rawTX.to === this.state.address) && rawTX.value !== '0'){
          console.log(rawTX, rawTX.value);
          var newTX = this.state.matchedTX.slice();
          newTX = newTX.concat([rawTX]);
          this.setState({
            matchedTX: newTX,
          });
          //console.log(rawTX);
        }
      }
    }
  }
  componentDidMount(){
    this.getTX();
  }
  handleSearchChange(event){
    event.preventDefault();
    this.setState({
      address: event.target.value,
    });
  }
  handleSearchSubmit(event){
    event.preventDefault();
    // checkValidity
    this.getTX();
  }
  render(){
    return(
      <div>
        <h1> We made it! </h1>
        <form onSubmit = {this.handleSearchSubmit}>
          <label>
            Search for transactions to an adress: 
            <input
              name = "address"
              type = "string"
              value = {this.state.adress}
              onChange = {this.handleSearchChange}/>
            <button> do it</button>
          </label>
        </form>
        <table className = "LeaderBoard">
          <tr>
            <th>From</th>
            <th> Value (wei)</th>
          </tr>
          {this.state.matchedTX.map((tx) => {
            return(
              <tr>
                <th>{tx.from}</th>
                <th>{tx.value}</th>
              </tr>
            )
          })}
        </table>
      </div>
    );
  }

}

export default LeaderBoard;
