import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Account Page, if account exists
    if (localStorage.getItem("W2-seed") !== null)
      navigate('/main-account');
  });

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
