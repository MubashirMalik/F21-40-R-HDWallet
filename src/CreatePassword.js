import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function CreatePassword() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    password: "",
    passwordConf: "",
    error: ""
  });
  const password = state.password;
  const passwordConf = state.passwordConf;
  const error = state.error;

  function validateInputs() {
    let _error = "";
    if (password !== passwordConf)
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
    if (_error === "")
      navigate(`/select-action/create-password/seed-phrase/${password}`);
  }

  return (
    <div className="Form">
      <div className="Form-body">
        <h1>Create Password</h1>
        <p>Your Password will act as a key for encrypting the Seed Phrase.</p>
        <form>
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
          <button onClick={handleSubmit}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
