import React, {Component} from 'react';
import NavBar from './NavBar';
import MainAccount from './MainAccount';
import Welcome from './Welcome';
import SelectAction from './SelectAction';
import CreatePassword from './CreatePassword';
import ImportWithSeed from './ImportWithSeed';
import SeedPhrase, {GenerateSeed, ConfirmSeed} from './SeedPhrase';

import {
  Route,
  Routes
 } from "react-router-dom";

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Routes>
          <Route exact path="/" element= { <Welcome />} />
          <Route exact path="/select-action" element={ <SelectAction />} />
          <Route exact path="/select-action/import-with-seed" element={ <ImportWithSeed />} />
          <Route exact path="/select-action/create-password" element={ <CreatePassword />} />
          <Route exact path="/select-action/create-password/seed-phrase/:password" element={ <SeedPhrase />} />
          <Route exact path="/select-action/create-password/seed-phrase/save/:password" element={ <GenerateSeed />} />
          <Route exact path="/select-action/create-password/seed-phrase/confirm/:password" element={ <ConfirmSeed />} />
          <Route exact path="/main-account" element={ <MainAccount />} />
        </Routes>
      </div>
    );
  }
}

export default App;
