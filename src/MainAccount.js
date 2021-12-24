import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './MainAccount.css';
import ethereumLogo from './images/logo.png';


const eccrypto = require("eccrypto");
const keccak256 = require('keccak256');
const pbkdf2 = require('pbkdf2')
const aes256 = require('aes256')

export default function MainAccount() {
  const [state, setState] = useState({publicKey: "", address: "", privateKey: ""});
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
      var derivedKey = pbkdf2.pbkdf2Sync(mnemonic, genHmac, 2048, 64, 'sha512');
      var masterPrivateKey = derivedKey.slice(0, 32);
      var masterChainCode = derivedKey.slice(32, 64);

      var _privateKey = masterPrivateKey;
      // Corresponding uncompressed (65-byte) public key.
      var _publicKey = eccrypto.getPublic(_privateKey);
      // We don't need the first 04 prefix
      _publicKey = _publicKey.slice(1, _publicKey.length)
      var _address = keccak256(_publicKey);
      // Address is last 20 bytes of keccak256 of publicKey
      var ethAddress =  _address.slice(12, _address.length);

      setState({...state, privateKey: Buffer.from(_privateKey).toString('hex') ,publicKey: Buffer.from(_publicKey).toString('hex'), address: "0x" + Buffer.from(ethAddress).toString('hex')});

    }
    generatePublicKey();
  }, []);

  return (
    <div className="MainAccount">
      <div className="MainAccount-header">
        <b>Account 1</b><br/>{`${address.substring(0, 7)}...${address.substring(36, address.length)}`}
      </div>
      <div className="MainAccount-body">
        <AccountInformation />
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


function AccountInformation() {
  return(
    <div className="AccountInformation">
      <img src={ethereumLogo}/>
      <div className="Balance-eth">0 ETH</div>
      <div className="Balance-usd">$0.00 USD</div>
      <div className="Action-buttons">
          <button>Send Transaction</button>
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
