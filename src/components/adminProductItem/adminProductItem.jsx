/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext.js";
import { Link  } from 'react-router-dom';

// import FavoriteHeart from "../favoriteHeart/favoriteHeart.jsx";
import style from './adminProductItem.module.scss'
import { AdminContext } from "../../context/adminContext.js";


const AdminProductItem = ({_id, img, title, price, preText }) => {

    const {deleteProductDB} = useContext(AdminContext);

    return (
        <div className={style.new_box}>
            <div className={style.inner__block}>
                <Link to={`/product/${_id}`} key={_id}>
                    <div className={style.info}>
                        <div className={style.image_box}>
                            <img className={style.image} src={img} alt="image new" />
                            {/* {newProduct && <img className={style.icon_new_box} src="./assets/icon-new.svg" alt="" />} */}
                        </div>
                        <div className={style.text_block}>
                            <h2 className={style.title}>{title}</h2>
                            <p className={style.text}>{preText}</p>
                        </div>
                        <div className={style.block_price}>
                            <div className={style.price}>
                                <span>Цена:</span>
                                <p>{price} BYN</p>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className={style.cart__button}>
                    <button className={style.button}>
                        <img src="/assets/btn-cart-update.svg" alt="Update" />
                    </button>
                    <button className={`${style.button} ${style.button__delete}`} onClick={() => deleteProductDB(_id)}>
                        <img src="/assets/btn-cart-delete.svg" alt="Delete" />
                    </button>
                </div>
            </div>
        </div>
    );
}
 
export default AdminProductItem;