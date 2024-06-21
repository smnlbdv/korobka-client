import style from './navigateAdmin.module.scss'
import { Link  } from 'react-router-dom';

const NavigateAdmin = () => {
    return ( 
        <div className={style.block__navigation}>
            <p className={style.title__panel}>Админ панель</p>
            <ul>
                <Link to="">
                    <li>Главная</li>
                </Link>
                <Link to="product-page">
                    <li>Боксы</li>
                </Link>
                <Link to="page/product">
                    <li>Товары</li>
                </Link>
                <Link to="page/postcard">
                    <li>Открытки</li>
                </Link>
                <li>Типы коробок</li>
                <li>Отзывы</li>
                <li>Пользователи</li>
                <li>Email</li>
            </ul>
            <p className={style.lowtitle__panel}>2024 © Все права защищены</p>
        </div>
     );
}
 
export default NavigateAdmin;