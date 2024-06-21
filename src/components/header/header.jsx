import { useContext, useEffect, useRef, useState} from 'react';
import { Link  } from 'react-router-dom';
import { Dropdown, Badge, Popover } from 'antd';
import { useSelector } from 'react-redux';

import style from './header.module.scss'
import './header.scss'
import '../../libs/ant.css'
import './ant.css'

import Button from '../button/button';
import { AuthContext } from "../../context/authContext.js";
import PopoverItem from '../popoverItem/popoverItem.jsx';

const Header = () => {
    const [countCart, setCountCart] = useState(0)
    const [items, setItems] = useState([])
    const [countFavorite, setCountFavorite] = useState(0)
    const [popoverCart, setPopoverCart] = useState([]);
    const [popoverLiked, setPopoverLiked] = useState([]);
    const { categories, userId, role, isAuth, scrollToTop } = useContext(AuthContext)
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [popoverVisibleTwo, setPopoverVisibleTwo] = useState(false);
    const linkHeader = useRef()
    const favoriteItem = useSelector(state => state.liked.liked)
    const cart = useSelector(state => state.cart.cart)
    const [isActive, setIsActive] = useState(false);

    const handleLinkClick = () => {
        setPopoverVisible(false);
    };

    const handleLinkClickTwo = () => {
        setPopoverVisibleTwo(false);
    };

    useEffect(() => {
        var contentCart;

        if(cart.length > 0) {
            let index = cart.length + 1
            contentCart = cart.map((element, index) => (
                <PopoverItem key={index} obj={element} handleLinkClickTwo={handleLinkClickTwo}/>
            ));
            contentCart.push(
                <Link to="cart" key={index} onClick={handleLinkClickTwo}>
                    <div className={style.popover__button}>
                        <p>Перейти в корзину</p>
                    </div>
                </Link>
            );
            setPopoverCart(contentCart);
        } else {
            setPopoverCart(null)
        }
    }, [cart]);

    useEffect(() => {
        var contentLiked;

        if(favoriteItem.length > 0) {
            let index = favoriteItem.length + 1
            contentLiked = favoriteItem.map((element, index) => (
                <PopoverItem key={index} obj={element} handleLinkClickTwo={handleLinkClick}/>
            ));
            contentLiked.push(
                <Link to="liked" key={index} onClick={handleLinkClick}>
                    <div className={style.popover__button}>
                        <p>Перейти в избранное</p>
                    </div>
                </Link>
            );
            setPopoverLiked(contentLiked);
        } else {
            setPopoverLiked(null)
        }
    }, [favoriteItem]);

    useEffect(() => {
        setCountCart(cart.length)
    }, [cart])

    useEffect(() => {
        setCountFavorite(favoriteItem.length)
    }, [favoriteItem])

    const getIdLink = (e) => {
        const li = e.target.closest('li')
        document.cookie = `id_category=${li.id}; expires= ${new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toUTCString()}; path=/; SameSite=None; Secure;`;
    }

    const handleToggleNavigation = () => {
        setIsActive(!isActive);

        if (!isActive) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    };

    const closeMenu = () => {
        setIsActive(false);
    };

    useEffect(() => {
        setItems(categories.map((item, index) => ({
            label: (
                <Link to={`ready-gifts/${item.key}`} ref={linkHeader} onClick={(event) => {
                    getIdLink(event) 
                    closeMenu()
                }}>
                  {item.value}
                </Link>
            ),
            key: index,
            id: item._id
        })))
    }, [categories])

    return (
        <header className={`${style.header}`}>
            <div className={`${style.header__inner} wrapper` }>
                <Link to="/" replace={true} onClick={scrollToTop}>
                    <div className="header__logo">
                        <img className="header__image" src="/assets/logo.svg" alt="logo" />
                        <span>Коробка</span>
                    </div>
                </Link> 

                <nav className={`${isActive ? style.navigation_active  : style.navigation} header-links`}>
                    <ul className={style.list__navigation}>
                        <li className={style.list__item}>
                            <Link to="constructor" onClick={closeMenu}>
                                <p className={style.list__text}>Собрать</p>
                            </Link>
                        </li>
                        <li className={style.list__item}>
                            <Dropdown menu={{ items }} trigger={['click']} >
                                <p className={style.all__boxes}>Готовые подарки</p>    
                            </Dropdown>
                        </li>
                        <li className={style.list__item}>
                            <Link to="contacts" onClick={closeMenu}>
                                <p className={style.list__text}>Контакты</p>
                            </Link>
                        </li>
                        <li className={style.list__item}>
                            <Link to="about-us" onClick={closeMenu}>
                                <p className={style.list__text}>О нас</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
                {
                    isAuth ? 
                    <div className={style.user_nav}>
                        {
                            <ul className={style.user_list}>
                                
                                <Popover placement="bottomRight" content={popoverCart} onOpenChange={(visible) => setPopoverVisibleTwo(visible)} open={popoverVisibleTwo}>
                                    <Link to="cart" onClick={() => {
                                        handleLinkClickTwo()
                                        closeMenu()
                                    }}>
                                        <li className={style.list_item}>
                                            <Badge count={countCart}>
                                                <img src="/assets/bag.svg" alt="bag logo" />
                                            </Badge>
                                            <p>Корзина</p>
                                        </li>
                                    </Link>
                                </Popover>
                                <Popover placement="bottomRight" content={popoverLiked} onOpenChange={(visible) => setPopoverVisible(visible)} open={popoverVisible}>
                                    <Link to="liked" onClick={() => {
                                        handleLinkClick()
                                        closeMenu()
                                    }}>
                                        <li className={style.list_item}>
                                            <Badge count={countFavorite}>
                                                <img src="/assets/heart.svg" alt="favorite logo" />
                                            </Badge>  
                                            <p>Избранное</p>
                                        </li>
                                    </Link>
                                </Popover>
                                <Link to="profile">
                                    <li className={style.list_item} onClick={closeMenu}>
                                        <img src="/assets/user.svg" alt="user logo" />
                                        <p>Профиль</p>
                                    </li>
                                </Link>  
                                <button className={style.header__burger} type="button" aria-label="Мобильное меню" onClick={handleToggleNavigation}>
                                    <span className={isActive ? style.span_open : style.span}></span>
                                </button> 
                                {
                                    role == 1 ? 
                                    <Link to={`/api/auth/admin/${userId}`}>
                                        <button className={style.admin__btn} type="button" onClick={closeMenu}>Админ панель</button>
                                    </Link>
                                    :
                                    ''
                                }
                            </ul>
                        }
                    </div>
                    :
                    <div className={style.burder_block}>
                        <div className={style.buttons_block}>
                            <Button title={"Вход"} path={'/api/auth/login'}/>
                            <Button title={"Регистрация"} path={'/api/auth/registration'}/>
                        </div>
                        <button className={style.header__burger} type="button" aria-label="Мобильное меню" onClick={handleToggleNavigation}>
                            <span className={isActive ? style.span_open : style.span}></span>
                        </button> 
                    </div>
                    
                }
            </div>
        </header>
    );
    };

export default Header;
