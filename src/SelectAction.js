import React, {Component} from 'react';
import Button from './Button';

import './SelectAction.css';

class SelectAction extends Component {
  render() {
    return (
      <div className="SelectAction">
        <h1>New to HDWallet?</h1>
        <div className="SelectAction-body">
          <div className="Box">
            <h4>No, I already have a Secret Recovery Phrase</h4>
            <p>Import your existing wallet using a Secret Recovery Phrase</p>
            <Button path="import-with-seed" text="Import Wallet" />
          </div>
          <div className="Box">
            <h4>Yes, let’s get set up!</h4>
            <p>This will create a new wallet and Secret Recovery Phrase</p>
            <Button path="create-password" text="Create a Wallet" />
          </div>
        </div>
      </div>
    );
  }
}

export default SelectAction;
