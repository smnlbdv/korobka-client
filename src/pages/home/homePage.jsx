import { Suspense, useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";

import style from "./homePage.module.scss"

import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import Loading from "../../components/loading/loading.jsx";

const HomePage = () => {

    const [scrollTop, setScroolTop] = useState(false)
    const { scrollToTop, contextHolder } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight) {
                setScroolTop(true);
            } else {
                setScroolTop(false);
            }
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return ( 
        <>
            <Header/>
                <Suspense fallback={<Loading />}>
                    <Outlet/>
                </Suspense>
                {
                    <>
                    {contextHolder}
                    <button href="#" className={`${style.back_to_top} ${scrollTop && style.back_to_top_active}`} onClick={() => scrollToTop()}>
                        <img src="/assets/arrow-up.svg" alt="Arrow up" />
                        <p>Наверх</p>
                    </button>
                    </>
                }
            <Footer/>
        </>
     );
}
 
export default HomePage;