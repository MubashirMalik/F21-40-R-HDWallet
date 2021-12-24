import { useNavigate } from 'react-router-dom';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="Welcome">
      <div className="Welcome-body">
        <h1>Welcome to HDWallet</h1>
        <p>Connecting you to Ethereum and the Decentralized Web.</p>
        <p>Based on electrum protocol.</p>
        <button onClick={() => { navigate('/select-action'); }}>
          Get Started
        </button>
      </div>
    </div>
  );
}
