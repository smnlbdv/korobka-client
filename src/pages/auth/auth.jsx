import { Outlet } from 'react-router-dom';

import style from './auth.module.scss'

const Auth = () => {

    return (
        <div className={style.wrapper}>
            <Outlet/>
        </div>
    );
}
 
export default Auth;