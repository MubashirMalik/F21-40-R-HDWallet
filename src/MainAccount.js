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
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/6cfcf2679b324ea89cbc429c63f26d56"));

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
        <b>Account 1</b><br/>{`${address.substring(0, 7)}...${address.substring(36, address.length)}`}
      </div>
      <div className="MainAccount-body">
        <AccountInformation address={address} />
        <AccountHistory />

        <div className="Key-info">
          There are no transactions to show.
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
  const [state, setState] = useState({balance: 0.0});
  const balance = state.balance;
  const address = props.address;

  useEffect(() => {
    // running the apicall every 10 seconds
    const interval = setInterval(() => {
      // prop is empty in 1st run of useEffect
      if (address != "")
        fetchBalance();
    }, 10000);
    return () => clearInterval(interval);
  });

  function fetchBalance() {
    console.log("Fetching Balance..")
    web3.eth.getBalance(address, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        setState({
          ...state, balance: Number(web3.utils.fromWei(result, "ether")).toFixed(2)
        });
      }
    })
  }

  function sendTransaction() {
    
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
        <input type="text" placeholder="Enter Address: 0x123"/>
        <input type="text" placeholder="Enter Amount: (ETH)"/>
        <button onClick={sendTransaction}>Send</button>
        <button onClick={toggleInputGroup}>Close</button>
      </div>
    </div>
  );
}

function AccountHistory() {
  return(
    <div className="AccountHistory">
      <div className="AccountHistory-title">History</div>
    </div>
  );
}
