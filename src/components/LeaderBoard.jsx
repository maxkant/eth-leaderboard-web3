import React, {Component} from 'react';
import {default as Web3} from 'web3';

class LeaderBoard extends Component{

  constructor(props){
    super(props);
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    web3.eth.defaultAccount = web3.eth.accounts[0];
    this.state = {
      address: '0xe11ba2b4d45eaed5996cd0823791e0c93114882d',
      web3: web3,
    };
  }
  async getTX(){
    const web3 = this.state.web3;
    const blockNumber = await web3.eth.getBlockNumber();
    for (let i = 0; i < blockNumber; i++){
      const block = await web3.eth.getBlock(i);
      const nTX = await web3.eth.getBlockTransactionCount(i);
      const txs = block.transactions;
      for (let j = 0; j < nTX; j++){
        const tx = txs[j];
        const rawTX = await web3.eth.getTransaction(tx);
        // do stuff with tx
        console.log(rawTX);
      }
    }
  }
  componentDidMount(){
  }
  render(){
    this.getTX();
    return(
      <div>
        <h1> We made it! </h1>
      </div>
    );
  }

}

export default LeaderBoard;
