import style from './footer.module.scss'
import { Link  } from 'react-router-dom';
import { Dropdown, Badge, Popover } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../../context/authContext';

const Footer = () => {
    const [items, setItems] = useState([])
    const { categories } = useContext(AuthContext)
    const linkHeader = useRef()

    const getIdLink = (e) => {
        const li = e.target.closest('li')
        document.cookie = `id_category=${li.id}; expires= ${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()}; path=/; SameSite=None; Secure;`;
    }

    useEffect(() => {
        setItems(categories.map((item, index) => ({
            label: (
                <Link to={`ready-gifts/${item.key}`} ref={linkHeader} onClick={(event) => getIdLink(event)}>
                  {item.value}
                </Link>
            ),
            key: index,
            id: item._id
        })))
    }, [categories])

    return ( 
        <footer className={`${style.footer} wrapper `}>
            <div className={style.footer__inner}>
                <div className={style.footer__inner_up}>
                    <div className="header__logo">
                        <img className="header__image" src="/assets/logo.svg" alt="logo" />
                        <span>Коробка</span>
                    </div>
                    <nav className={style.navigation}>
                        <ul className={style.list__navigation}>
                            <li className={style.list__item}>
                                <Link to="constructor">
                                    <p className={style.list__text}>Собрать</p>
                                </Link>
                            </li>
                            <li className={style.list__item}>
                                <Dropdown menu={{ items }} trigger={['click']} >
                                    <p className={style.all__boxes}>Готовые подарки</p>    
                                </Dropdown>
                            </li>
                            <li className={style.list__item}>
                                <Link to="contacts">
                                    <p className={style.list__text}>Контакты</p>
                                </Link>
                            </li>
                            <li className={style.list__item}>
                                <Link to="about-us">
                                    <p className={style.list__text}>О нас</p>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className={style.contact}>
                        <a href="https://twitter.com/?lang=en" target="blank">
                            <img src="/assets/twitter.svg" alt="" />
                        </a>
                        <a href="https://web.telegram.org/" target="blank">
                            <img src="/assets/telegram.svg" alt="" />
                        </a>
                        <a href="https://ru-ru.facebook.com/" target="blank">
                            <img src="/assets/facebook.svg" alt="" />
                        </a>
                        <a href="https://www.youtube.com/" target="blank">
                            <img src="/assets/youtube.svg" alt="" />
                        </a>
                    </div>
                </div>
                <div className={style.footer__inner__list}>
                    <p className={style.footer_text}>2024 © Все права защищены</p>
                </div>
            </div>
        </footer>
     );
}
 
export default Footer;