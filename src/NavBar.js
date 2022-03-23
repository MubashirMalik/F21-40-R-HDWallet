import './NavBar.css';

function NavBar() {
  return (
    <div className="NavBar">
      <li className="NavBar-logo">HDWallet</li>
      <li className="NavBar-newtork">
        <select>
          <option value="testnet_public">Testnet Public</option>
          <option value="testnet_private">Testnet Private</option>
          <option value="mainnet_public">Mainnet Public</option>
          <option value="mainnet_private">Mainnet Private</option>
        </select>
      </li>
    </div>
  );
}


export default NavBar;
