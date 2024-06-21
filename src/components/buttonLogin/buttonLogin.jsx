/* eslint-disable react/prop-types */
import style from './buttonLogin.module.scss'

const ButtonLogin = ({title}) => {
    return ( 
        <input className={style.btn_login} type="submit" value={title}/>
     );
}
 
export default ButtonLogin;