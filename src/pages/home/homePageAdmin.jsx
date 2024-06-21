import { useContext } from "react";
import { Outlet } from "react-router-dom";

import NavigateAdmin from "../../components/navigateAdmin/navigateAdmin";

import style from './homePageAdmin.module.scss'
import { AdminContext } from "../../context/adminContext";

const HomePageAdmin = () => {
    
    const { contextHolder, contextHolderEmail } = useContext(AdminContext)
    return ( 
        <div className={style.wrapper_admin}>
            {contextHolder}
            {contextHolderEmail}
            <NavigateAdmin />
            <Outlet/>
        </div>
     );
}
 
export default HomePageAdmin;