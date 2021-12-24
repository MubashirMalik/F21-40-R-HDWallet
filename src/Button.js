import {useNavigate} from 'react-router';
import './Button.css';

function Button(props) {
  const navigate = useNavigate();
  function handleClick() {
    if (props.path !== "")
      navigate(props.path);
  }

  return(
    <div className="Button">
      <button onClick={ props.onClick ? props.onClick : handleClick }>{ props.text }</button>
    </div>
  );
}

export default Button;
