import { useParams, useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import './SeedPhrase.css';

const bip39 = require('bip39');
const FileSaver = require('file-saver');

export default function SeedPhrase() {
  const navigate = useNavigate();
  const { password } = useParams();
  return(
    <div className="SeedPhrase">
      <div className="SeedPhrase-body">
        <h1>IMPORTANT! SECURE YOUR WALLET!</h1>
        <div className="SeedPhrase-box">
          <h4>What is a Secret Recovery Phrase?</h4>
          <p>
            Your Secret Recovery Phrase is a 12-word phrase that is the “master key” to your wallet and your funds
          </p>
        </div>
        <div className="SeedPhrase-box">
          <h4>How do I save my Secret Recovery Phrase?</h4>
          <p>
            <li>Save in a password manager.</li>
            <li>Store in a bank vault.</li>
            <li>Store in a safe-deposit box.</li>
            <li>Write down and store in multiple secret places.</li>
          </p>
        </div>
        <div className="SeedPhrase-box">
          <h4>Should I share my Secret Recovery Phrase?</h4>
          <p>
            Never, ever share your Secret Recovery Phrase, not even with HDWallet!
          </p>
          <p>
            If someone asks for your recovery phrase they are likely trying to scam you and steal your wallet funds
          </p>
        </div>
        <button onClick={() => { navigate(`/select-action/create-password/seed-phrase/save/${password}`); }}>
          I Understand! Next
        </button>
      </div>
    </div>
  );
}

export function GenerateSeed() {
  const navigate = useNavigate();
  const { password } = useParams();

  // Generate Seed with 128-bit entropy
  const mnemonic = bip39.generateMnemonic();
  // Encrypt the seed with AES-256 CBC
  const key = password;
  //const ciphertext = aes256.encrypt(key, mnemonic);
  // Store the cipher to Browser
  localStorage.setItem("W2-seed", "ciphertext");
  localStorage.setItem("W2-pass", password);

  function downloadSeed() {
    var blob = new Blob([mnemonic], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "secret_seed_phrase.txt");
  }

  return(
    <div className="SeedPhrase">
      <div className="SeedPhrase-body">
        <h1>Secret Recovery Phrase</h1>
        <div className="SeedPhrase-box">
          <p>Your Secret Recovery Phrase makes it easy to back up and restore your account.</p>
          <p className="Warning">WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.</p>
        </div>
        <div className="SeedPhrase-box">
          <b>{mnemonic}</b>
        </div>
        <div className="SeedPhrase-box">
          <p className="Warning">Download this Secret Recovery Phrase and keep it stored safely on an external encrypted hard drive or storage medium.</p>
        </div>
        <div className="Buttons-group">
          <button onClick={downloadSeed}>Download</button>
          <button onClick={() => { navigate('/main-account'); }}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
