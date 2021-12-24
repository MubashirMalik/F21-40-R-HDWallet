import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ImportWithSeed.css';

const bip39 = require('bip39');
const aes256 = require('aes256');

export default function ImportWithSeed() {
  const navigate = useNavigate();
  const [state, setState] = useState({mnemonic: "", password: "", passwordConf: "", error: ""});
  const mnemonic = state.mnemonic;
  const error = state.error;
  const password = state.password;
  const passwordConf = state.passwordConf;

  function validateInputs() {
    let _error = "";
    if (!bip39.validateMnemonic(mnemonic))
      _error = "Invalid Seed Phrase.";
    else if (password !== passwordConf)
        _error = "Passwords don't match.";
    else if (password.length < 8)
        _error = "Password must be atleast 8 chars  long.";
    return _error;
  }

  function handleChange(evt) {
    setState({
      ...state, [evt.target.name]: evt.target.value, error: validateInputs()
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    let _error = validateInputs();
    setState({
      ...state, [evt.target.name]: evt.target.value, error: _error
    });

    if (_error === "") {
      // Encrypt the seed with AES-256 CBC
      const ciphertext = aes256.encrypt(password, mnemonic);
      // Store the cipher to Browser
      localStorage.setItem("W2-seed", ciphertext);
      localStorage.setItem("W2-pass", password);
      navigate(`/main-account`);

    }
  }

  return (
    <div className="Form">
      <div className="Form-body">
        <h1>Import a wallet with Secret Recovery Phrase</h1>
        <p>Seperate each word with a single space.</p>
        <strong>
          Example: army van defense carry jealous true garbage claim echo media make crunch
        </strong>
        <form>
          <label htmlFor="mnemonic">Secret Recovery Phrase (12 words)</label>
          <input
            type="text"
            id="mnemonic"
            name="mnemonic"
            value={mnemonic}
            onChange={handleChange}
          />
          <label htmlFor="password">New Password (min 8 characters)</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            autoComplete="true"
          />
          <label htmlFor="passwordConf">Confirm Password</label>
          <input
            type="password"
            id="passwordConf"
            name="passwordConf"
            value={passwordConf}
            onChange={handleChange}
            autoComplete="true"
          />
          <div className="Warning">{ error }</div>
          <button onClick={handleSubmit}>Import Wallet</button>
        </form>
      </div>
    </div>
  );

}
