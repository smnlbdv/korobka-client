/* eslint-disable react/prop-types */
import { useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";

import Product from "../../components/product/product.jsx";
import ButtonNull from "../../components/buttonNull/buttonNull.jsx";

import style from './liked.module.scss'
import { useDispatch, useSelector } from "react-redux";
import { delProductFavoriteAsync } from "../../store/likedSlice.js";

const Liked = () => {
    const { contextHolder } = useContext(AuthContext)
    const favoriteItem = useSelector(state => state.liked.liked)
    const dispatch = useDispatch()

    const clearFavorite = () => {
        favoriteItem.forEach(element => {
            dispatch(delProductFavoriteAsync(element._id))
        });
    }

    return ( 
        <section className={`${style.section_cart} wrapper`}>
            {contextHolder}
            <div className={style.bg_liked}></div>
            <ul className="bread-crumbs">
                <Link to="/">
                <li>Главная</li>
                </Link>
                <li>Избранное</li>
            </ul>
            <div className={style.section_cart__header}>
                <h2 className={`${style.section_title} section__title`}>Избранное</h2>
                {
                    favoriteItem.length !==0 &&
                    <p onClick={clearFavorite}>Удалить все</p>
                }
            </div>
            {
                favoriteItem.length !== 0 ?
                <div className={style.favorite_items}>
                    {
                        favoriteItem.slice().reverse().map((obj, index) => 
                            <Product
                                key={obj._id}
                                favorite={true}
                                {...obj}
                            />
                        )
                    }
                </div>
                :
                <div className={style.cart__block_null}>
                    <div className={style.block__info}>
                        <p className={style.title}>У вас нет понравившихся товаров</p>
                        <div className={style.btn_block}>
                            <ButtonNull title={"В каталог"} path={'/ready-gifts/all'}/>
                            <ButtonNull title={"Собрать"} path={"/constructor"} />
                        </div>
                    </div>
                </div>
            }
        </section>
     );
}
 
export default Liked;