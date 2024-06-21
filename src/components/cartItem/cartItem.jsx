/* eslint-disable react/prop-types */
import { useEffect, useState, useContext, useCallback, memo } from "react";
import { AuthContext } from "../../context/authContext.js";
import { Link  } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItemAsync } from "../../store/cartSlice.js";
import { addCheckArray, removeCheckArray } from "../../store/cartSlice.js";

import style from "./cartItem.module.scss";
import CounterInput from "../counterInput/counterInput.jsx";
import { addProductFavoriteAsync, delProductFavoriteAsync } from "../../store/likedSlice.js";

const CartItem = ({ _id, img, title, preText, price, count, checkItem }) => {
  const [cartCheck, setCartCheck] = useState();
  const [isFavorite, setIsFavorite] = useState(checkItem);
  const { openNotification } = useContext(AuthContext);
  const dispatch = useDispatch()
  const [newTotalFormat, setNewTotalFormat] = useState()
  const checkArray = useSelector(state => state.cart.checkArray)

  useEffect(() => {
    setNewTotalFormat(price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}))
  }, [])

  useEffect(() => {
    if(checkArray.some((product) => product === _id)) {
      setCartCheck(true)
    } else {
      setCartCheck(false)
    }
  }, [checkArray])

  const cartCheckClick = () => {
    if (!cartCheck) {
        setCartCheck(true);
        dispatch(addCheckArray(_id))
    } else {
        setCartCheck(false);
        dispatch(removeCheckArray(_id))
    }
  };

  const clickDeleteButton = () => {
    dispatch(deleteCartItemAsync(_id))
            .then(() => {
              openNotification('bottomRight', "Товар удален из корзины")
            })
  };

  const clickHeart = () => {
    if(isFavorite) {
      setIsFavorite(false)
      dispatch(delProductFavoriteAsync(_id))
              .then(() => {
                openNotification('bottomRight', "Товар удален из избранного")
              })
    } else {
      setIsFavorite(true)
      dispatch(addProductFavoriteAsync(_id))
              .then(() => {
                openNotification('bottomRight', "Товар добавлен в избранное")
              })
    }
  };

  return (
    <div className={`${style.cart__item_block} ${cartCheck && style.cart__item_active}`}>
      <img className={style.check__image} src={cartCheck ? "/assets/cart-check-active.svg" : "/assets/cart-check.svg" } alt="Cart check" onClick={cartCheckClick}/>
      <Link to={`/product/${_id}`} key={_id}>
        <img className={style.image_product} src={img} alt="Image item" />
      </Link>
      <div className={style.cart__item_info}>
        <p className={style.title}>{title}</p>
        <p className={style.text}>{preText}</p>
      </div>
      <CounterInput
        count={count}
        _id={_id}
      />
      <p className={style.price}>{newTotalFormat} BYN</p>
      <div className={!isFavorite ? style.page__product_love : style.page__product_nolove} onClick={clickHeart}>
        <img className={style.favorite} src={isFavorite ? "/assets/favorite-love.svg" : "/assets/love.svg"} alt=""/>
      </div>
      <button className={style.btn__delete_item}>
        <img
          className={style.delete_icon}
          src="/assets/btn-cart-delete.svg"
          alt=""
          onClick={clickDeleteButton}
        />
      </button>
    </div>
  );
};

export default CartItem;
