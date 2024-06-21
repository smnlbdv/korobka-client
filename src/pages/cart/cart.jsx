/* eslint-disable react/prop-types */
import { useState, useContext, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";
import debounce from "debounce";
import api from "../../api/api.js";
import * as Yup from "yup";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useDispatch, useSelector } from "react-redux";
import { addCheckArray, removeCheckArray, deleteCartItemAsync, calculatePrice, calculatePriceCheck, orderPushItems, setPromo, setTotalPrice} from "../../store/cartSlice.js";

import CartItem from "../../components/cartItem/cartItem.jsx";
import ButtonNull from "../../components/buttonNull/buttonNull.jsx";
import Product from "../../components/product/product.jsx";

import style from "./cart.module.scss";
import './cart.scss'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFormik } from "formik";
import { resetOrderObj } from "../../store/prefabricatedGiftSlice.js";

const Cart = ({}) => {
  const favoriteItem = useSelector(state => state.liked.liked)
  const [cartCheckAll, setCartCheckAll] = useState();
  const cartTotalPrice = useSelector(state => state.cart.cartPrice)
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart.cart)
  const checkArray = useSelector(state => state.cart.checkArray)
  const totalPrice = useSelector(state => state.cart.totalPrice)
  const [sale, setSale] = useState({id: null, active: false, percentage: 0,});
  const navigate = useNavigate();

  useEffect(() => {
    const result = sale.active === true
          ? (cartTotalPrice - cartTotalPrice * (sale.percentage / 100)).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})
          : cartTotalPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    
    if(sale.active) {
      dispatch(setPromo(sale));
    }

    dispatch(setTotalPrice(result))
    
  }, [cartTotalPrice, sale])

  const clickCheck = () => {
    if (!cartCheckAll) {
      setCartCheckAll(true);
      cart.forEach((item) => {
        if (!checkArray.includes(item._id)) {
          dispatch(addCheckArray(item._id));
        }
      });
    } else {
      setCartCheckAll(false);
      cart.forEach((item) => {
        dispatch(removeCheckArray(item._id))
      })
    }
  };

  const checkItem = (id) => {
    return favoriteItem.some((product) => product._id === id);
  }

  const clearInputPromo = () => {
    formikCart.resetForm()
  }

  const formikCart = useFormik({
    initialValues: {
      valuePromo: ""
    },
    onSubmit: async (values) => {
      let foundItem = []
      if(checkArray.length !== 0) {
        checkArray.forEach(checkItem => {
          const newfoundItem = cart.find(cartItem => cartItem._id === checkItem);
          if (newfoundItem) {
            foundItem.push(newfoundItem);
        }
        });
        dispatch(orderPushItems(foundItem));
        dispatch(resetOrderObj())
        navigate("order")
      } else {
        dispatch(orderPushItems(cart))
        dispatch(resetOrderObj())
        navigate("order")
      }
    },
  });

  useEffect(() => {
    if(cart.length === checkArray.length) {
      setCartCheckAll(true)
    } else {
      setCartCheckAll(false)
    }
  }, [checkArray])

  useEffect(() => {
    if(checkArray && checkArray.length !== 0) {
      dispatch(calculatePriceCheck())
    } else {
      dispatch(calculatePrice())
    }
  }, [checkArray, cart]);

  const delayedSearch = debounce(async (search) => {
    if(search.trim() !== '') {
        try {
        await api.post(`/api/cart/promo`, { promoCode: search })
            .then((response) => {
                if (response.status === 200) {
                  setSale({
                    id: response.data.id,
                    active: response.data.active,
                    percentage: response.data.percentage,
                  });
                }
              })
            .catch((response) => {
              if (response.response.status === 404) {
                setSale({
                  active: false,
                  percentage: 0,
                });
              }
            });
        } catch (error) {
          console.log(error.message);
        }
    }
  }, 1000);

  const deleteChecket = () => {
    checkArray.forEach((element) => {
      dispatch(deleteCartItemAsync(element))
      dispatch(removeCheckArray(element._id))
    });
  };

  return (
      <section className={`${style.section_cart} wrapper`}>
        <div className={style.bg_cart}></div>
        <ul className="bread-crumbs">
          <Link to="/">
            <li>Главная</li>
          </Link>
          <li>Корзина</li>
        </ul>
        <div className={style.cart__header__button}>
          <h2 className={`${style.section_title} section__title`}>Корзина</h2>
          {cart.length !== 0 && (
            <div className={style.button__check__all} onClick={clickCheck}>
              <img
                className={style.check__image}
                src={
                  cartCheckAll
                    ? "/assets/cart-check-active.svg"
                    : "/assets/cart-check.svg"
                }
                alt="Cart check"
              />
              <p>Выбрать все</p>
            </div>
          )}
          {(checkArray && checkArray.length !== 0 && cart.length !== 0) && (
            <p className={style.button__delete__hidden} onClick={deleteChecket}>
              Удалить выбранное
            </p>
          )}
        </div>
        {cart.length !== 0 ? (
          <>
            <div className={style.cart__main_block}>
            <div className={style.cart__left_block}>
              <span className={style.cart__span}></span>
              <div className={style.cart__list}>
                {cart.slice().reverse().map((obj, index) => (
                  <CartItem
                    key={obj._id}
                    calculatePrice={calculatePrice}
                    checkArray={checkArray}
                    checkItem={checkItem(obj._id)}
                    {...obj}
                  />
                ))}
              </div>
            </div>
            <form className={style.cart__right_block} onSubmit={formikCart.handleSubmit}>
              <h3 className={style.title}>Ваш заказ</h3>
              <div className={style.cart__info}>
                <div className={style.info__item}>
                  <p>Кол-во:</p>
                  <p>
                    {checkArray.length !== 0 ? checkArray.length : cart.length}{" "}
                    шт.
                  </p>
                </div>
                <div className={style.info__item}>
                  <p>Сумма:</p>
                  <p>{cartTotalPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})} BYN</p>
                </div>
                <div className={style.info__item}>
                  <p>Скидка:</p>
                  <p>{sale.percentage} %</p>
                </div>
              </div>
              <div className={`${formikCart.values.valuePromo ? (sale.active ? style.promo__active__true : style.promo__active__false) : style.promo}`}>
                <input
                  id="valuePromo"
                  name="valuePromo"
                  type="text"
                  placeholder="Промокод..."
                  onChange={(event) => {
                    if (event.target.value.length === null) {
                      setSale({
                        active: false,
                        percentage: 0
                      });
                    } else {
                      formikCart.handleChange(event)
                      delayedSearch(event.target.value);
                    }
                  }}
                  value={formikCart.values.valuePromo}
                />
                <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInputPromo}/>
              </div>
              <div className={style.pay}>
                <div className={style.pay_item}>
                  <p>Итог к оплате: </p>
                  <p className={style.totalPrice}>
                      {totalPrice} BYN
                  </p>
                </div>
                <button className={style.btn_checkout} type="submit">Оформить</button>
              </div>
            </form>
          </div>
          {
            favoriteItem.length != 0 &&
            <div className={style.liked__product__list}>
              <p className={style.liked__product__title}>Ваше избранное</p>
              {
                <div className={style.favorite_items}>
                  <Swiper
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    slidesPerView={4}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={false}
                    modules={[Autoplay, Pagination]}
                    className={`${style.mySwiper_cart} mySwiper_cart`}
                  >
                    {
                      favoriteItem.slice().reverse().map((obj, index) => 
                        <SwiperSlide key={index}>
                          <Product
                            favorite={true}
                            {...obj}
                          />
                        </SwiperSlide>
                      )
                    }
                  </Swiper>
                </div>
              }
            </div>
          }
          </>
          
        ) : (
          <div className={style.cart__block_null}>
            <div className={style.block__info}>
              <p className={style.title}>Корзина пуста</p>
              <div className={style.btn_block}>
                <ButtonNull title={"В каталог"} path={"/ready-gifts/all"} />
                <ButtonNull title={"Собрать"} path={"/constructor"} />
              </div>
            </div>
          </div>
        )}
      </section>
  );
};

export default Cart;
