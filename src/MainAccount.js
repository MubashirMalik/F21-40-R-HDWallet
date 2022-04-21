import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MainAccount.css';
import ethereumLogo from './images/eth_logo.svg';

const eccrypto = require("eccrypto");
const keccak256 = require('keccak256');
const pbkdf2 = require('pbkdf2')
const aes256 = require('aes256')
const bs58 = require('bs58');
const Web3 = require("web3");

// INFURA PROVIDER
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/066303f832b54234a28f091297df39bc"));

const NETWORK = "ropsten";

const VERSION_BYTES = {
    'mainnet_public': '0488b21e',
    'mainnet_private': '0488ade4',
    'testnet_public': '043587cf',
    'testnet_private': '04358394',
}

export default function MainAccount() {
  const [state, setState] = useState({publicKey: "", address: "", privateKey: ""});
  const navigate = useNavigate();
  const publicKey = state.publicKey;
  const privateKey = state.privateKey;
  const address = state.address;

  useEffect(() => {
    function generatePublicKey() {
      var encryptedBuffer = localStorage.getItem('W2-seed');
      var key = localStorage.getItem('W2-pass');

      var mnemonic = aes256.decrypt(key, encryptedBuffer);

      // From Mnemonic to Seed
      var genHmac="mnemonic";
      var seed = pbkdf2.pbkdf2Sync(mnemonic, genHmac, 2048, 64, 'sha512');
      var masterSecretKey = seed.slice(0, 32);
      var masterChainCode = seed.slice(32, 64);

      const versionBytes = VERSION_BYTES['testnet_public'] // 4 bytes
      const depthByte = '00'; // 1 byte
      const parentFingerprint = '00000000'; // 4 bytes
      const childNumBytes = '00000000'; // 4 bytes
      const chainCodeBytes = Buffer.from(masterChainCode).toString('hex');
      const keyBytes = '00' + Buffer.from(masterSecretKey).toString('hex'); // 33 bytes
      const allBytes = versionBytes + depthByte + parentFingerprint + childNumBytes + chainCodeBytes + keyBytes;
      console.log(allBytes);

      console.log(bs58.encode( Buffer.from(allBytes, 'hex')));

      var _privateKey = masterSecretKey;
      // Corresponding uncompressed (65-byte) public key.
      var _publicKey = eccrypto.getPublic(_privateKey);
      // We don't need the first 04 prefix
      _publicKey = _publicKey.slice(1, _publicKey.length)
      var _address = keccak256(_publicKey);
      // Address is last 20 bytes of keccak256 of publicKey
      var ethAddress =  _address.slice(12, _address.length);

      setState({...state, privateKey: Buffer.from(_privateKey).toString('hex') ,publicKey: Buffer.from(_publicKey).toString('hex'), address: "0x" + Buffer.from(ethAddress).toString('hex')});
    }

    // Redirect to Starting Page, if account doesn't exist
    if (localStorage.getItem("W2-seed") === null)
      navigate('/');
    else
      generatePublicKey();
  }, []);

  return (
    <div className="MainAccount">
      <div className="MainAccount-header">
        <div>
          <b>Account 1 [{NETWORK}]</b>
          <br/>{`${address.substring(0, 7)}...${address.substring(36, address.length)}`}
        </div>
      </div>
      <div className="MainAccount-body">
        <AccountInformation address={address} privateKey={privateKey}/>
        <AccountHistory address={address} />

        <div className="Key-info">
          <h3>Account Information</h3>
          <b>Private Key:</b> {privateKey}
          <br/>
          <b>Public Key:</b> {publicKey}
          <br/>
          <b>Address:</b> {address}
        </div>
      </div>
    </div>
  );
}

function AccountInformation(props) {
  const [state, setState] = useState({
    balance: 0.0,
    recvrAddress: "",
    amount: "",
    message: "",
    transactionMessage: "",
    privateKey: ""
  });
  const balance = state.balance;
  const address = props.address;
  const recvrAddress = state.recvrAddress;
  const amount = state.amount;
  const message = state.message;
  const transactionMessage = state.transactionMessage;
  const privateKey = props.privateKey;

  function handleChange(evt) {
    setState({
      ...state, [evt.target.name]: evt.target.value
    });
  }

  useEffect(() => {
    // running the apicall every 10 seconds
    const interval = setInterval(() => {
      if (address != "")
        fetchBalance();
    }, 10000);
    return () => clearInterval(interval);
  });

  function fetchBalance() {
    setState({...state, message: "Syncing account balance.."});
    web3.eth.getBalance(address, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        setState({
          ...state, balance: Number(web3.utils.fromWei(result, "ether")).toFixed(2), message: "Balance updated.."
        });
      }
    })
  }

  async function sendTransaction() {
    setState({...state, transactionMessage: "Getting nonce from chain.."});
    // get nonce: total number of transactions done by account
    const nonce = await web3.eth.getTransactionCount(address, 'latest').catch(
      function(err) {
        if (!err) {
          setState({
            ...state,
            transactionMessage: `Nonce = ${nonce}
          `});
        } else {
          setState({
            ...state, transactionMessage: err.message
          });
        }
     });

    setState({...state, transactionMessage: "Creating transaction.."});
    // create transaction
    console.log(await web3.eth.getGasPrice())
    const transaction = {
      'to': recvrAddress,
      'value': web3.utils.toWei(amount,'ether'),
      'gas': 3000000, //await web3.eth.getGasPrice(),
      'maxFeePerGas': 1000000108000,
      'nonce': nonce,
      'maxPriorityFeePerGas':1000000108000
    }

    setState({...state, transactionMessage: "Signing transaction.."});
    // sign transaction
    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    setState({...state, transactionMessage: `Pending Transaction: ${signedTx.transactionHash}`});
    // send transaction
    web3.eth.sendSignedTransaction(signedTx.rawTransaction).catch( function(err, hash) {
     if (!err) {
       setState({
         ...state,
         transactionMessage: `The hash of your transaction is: ${hash}You can check transaction status on Etherscan!`});
     } else {
       setState({
         ...state, transactionMessage: err.message
       });
     }
    });
  }

  function toggleInputGroup() {
    let div = document.getElementsByClassName("input-group")[0];
    if (div.style.display === "flex") {
      div.style.display = "none";
    } else {
      div.style.display = "flex";
    }
  }

  return(
    <div className="AccountInformation">
      <img src={ethereumLogo}/>
      <div className="Balance-eth">{balance} ETH</div>
      <div title="May be inaccurate due to volatile rate changes!" className="Balance-usd">${(balance * 3000).toFixed(2)} USD</div>
      <div className="Action-buttons">
          <button onClick={toggleInputGroup}>Send Transaction</button>
      </div>
      <div class="input-group">
        <input
          name="recvrAddress"
          type="text"
          placeholder="Enter Address: 0x123"
          value={recvrAddress}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Enter Amount: (ETH)"
          name="amount"
          value={amount}
          onChange={handleChange}
        />
        <button onClick={sendTransaction}>Send</button>
        <button onClick={toggleInputGroup}>Close</button>
      </div>
      <div className="Event-messages">
        <span>Events Log</span>:
          <div>
            {message === ""? "..." : message}
          </div>
          <div>
            {transactionMessage === ""? "..." : transactionMessage}
          </div>
      </div>
    </div>
  );
}

function AccountHistory(props) {
  const [state, setState] = useState({
    transactions: []
  });
  const address = props.address;
  const transactions = state.transactions;

  useEffect(() => {
    // running the apicall every 10 seconds
    const interval = setInterval(() => {
      if (address != "")
        fetchTransactions();
    }, 10000);
    return () => clearInterval(interval);
  });

  function fetchTransactions() {
    var url = `https://api-${NETWORK}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=P3V5IHI9V2P5NJMST4WRE7J8SV9FG24E4W`
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    setState({...state, transactions: JSON.parse(xmlHttp.responseText) });
    return;
  }

  function renderTransactions() {
    var txs = []

    if (transactions.length == 0) {
      return <div className="AccountHistory-transactions">There are no transactions to show.</div>;
    } else {
      for (const [key, value] of Object.entries(transactions["result"])) {
        var txData = []
        if (value['from'] == address) {
          txData.push("Send")
        } else {
          txData.push("Receive")
        }
        txData.push(value["value"]/1000000000000000000)
        txData.push(value["hash"])
        txs.push(txData)
      }
      const listTransactions = txs.map((tx) =>
        <div className="AccountHistory-transactions">
          <div className="upper-layer">
            <span>{ tx[0] }</span>
            <span>{ tx[1] }</span>
          </div>
          <div className="lower-layer">
            <span>{ tx[2] }</span>
          </div>
        </div>
      );
      return listTransactions;
    }
  }

  return(
    <div>
      <div className="AccountHistory">
        <div className="AccountHistory-title">History</div>
      </div>
      { renderTransactions() }
    </div>
  );
}
