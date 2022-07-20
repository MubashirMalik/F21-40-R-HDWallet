import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


export default function CreatePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    passwordConf: "",
  });
  
  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {...prevFormData, [event.target.name]: event.target.value}
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let _error = "";
    if (formData.password !== formData.passwordConf)
      _error = "Passwords don't match.";
    else if (formData.password.length < 8)
      _error = "Password must be atleast 8 chars  long.";

    _error !== "" ? setError(_error) : navigate(`/select-action/create-password/seed-phrase/${formData.password}`);
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
            value={formData.password}
            onChange={handleChange}
            autoComplete="true"
          />
          <label htmlFor="passwordConf">Confirm Password</label>
          <input
            type="password"
            id="passwordConf"
            name="passwordConf"
            value={formData.passwordConf}
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
