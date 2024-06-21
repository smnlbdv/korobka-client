/* eslint-disable react/prop-types */
import style from './button.module.scss'
import { Link } from 'react-router-dom' 

const Button = ({title, path, logout}) => {
    return ( 
        <Link to={path}>
            <button className={style.button_login} onClick={logout}>{title}</button>
        </Link>
     );
}
 
export default Button;