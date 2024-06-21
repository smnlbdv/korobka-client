/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext.js";
import ContentLoader from "react-content-loader"
import { Link  } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { addProductCartAsync, decreaseCartItemAsync, deleteCartItemAsync, increaseCartItemAsync } from "../../store/cartSlice.js";

import FavoriteHeart from "../favoriteHeart/favoriteHeart.jsx";
import style from './product.module.scss'

const Product = ({_id, img, title, price, preText, loading = true, favorite, count, newProduct = false }) => {
    const [isAdded, setIsAdded] = useState(false)
    const [countProduct, setCountProduct] = useState()
    const { openNotification, openNotificationError } = useContext(AuthContext)
    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart.cart)

    const clickBtnAdd = async () => {
        dispatch(addProductCartAsync(_id))
                .then(() => {
                    const product = cart.find(obj => obj._id === _id);
                    if(!product) {
                        setCountProduct(1)
                        setIsAdded(true)
                    } else {
                        setCountProduct(product.count + 1)
                        setIsAdded(true)
                    }
                    openNotification('bottomRight', 'Товар успешно добавлен в корзину');
                })
                .catch(() => {
                    setCountProduct(0)
                    setIsAdded(false)
                    openNotificationError('bottomRight', 'Товара недостаточно на складе');
                })
    }

    useEffect(() => {
        if(count === 0) {
            const isItemInCart = cart.some(item => item._id === _id);
            if (isItemInCart) {
                dispatch(deleteCartItemAsync(_id))
            }
        }
    }, [count])
  
    const addProduct = () => {
        if(countProduct >= 200) {
            setCountProduct(countProduct)
        } else {
            dispatch(increaseCartItemAsync({_id, countProduct}))
                    .then(result => {
                        if(result.payload.increase) { 
                            setCountProduct(countProduct + 1)
                            openNotification('bottomRight', 'Количество товара увеличено');
                        }
                    })
                    .catch(() => {
                        setCountProduct(countProduct)
                        openNotificationError('bottomRight', 'Товара недостаточно на складе');
                    })
        }
    }

    const subtractProduct = () => {
        if(countProduct <= 1) {
            dispatch(deleteCartItemAsync(_id))
                    .then(() => {
                        setIsAdded(false)
                    })
        } else {
            dispatch(decreaseCartItemAsync(_id))
                    .then(() => {
                        setCountProduct(countProduct - 1)
                    })
        }
    }

    return (
        
        <div className={!loading ? style.new_box_loader : style.new_box}>
            {
                !loading ?
                (
                    <ContentLoader 
                        speed={2}
                        width={250}
                        height={350}
                        viewBox="0 0 250 350"
                        backgroundColor="#fdfdfd20"
                        foregroundColor="#ffffff10"
                    >
                        <rect x="35" y="0" rx="10" ry="10" width="190" height="120" /> 
                        <rect x="50" y="142" rx="5" ry="5" width="160" height="25" /> 
                        <rect x="25" y="180" rx="5" ry="5" width="205" height="64" /> 
                        <rect x="25" y="255" rx="5" ry="5" width="125" height="23" /> 
                        <rect x="0" y="292" rx="10" ry="10" width="250" height="46" />
                    </ContentLoader>
                )
                :
                (
                    <>
                        <Link to={`/product/${_id}`} key={_id}>
                            <div className={style.info}>
                                <div className={style.image_box}>
                                    <img className={style.image} src={img} alt="image new" />
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
                            <div className={style.button__add_cart}>
                                {
                                    isAdded ? 
                                    <div className={style.counter__block}>
                                        <img className={style.counter__image} src="/assets/product-cart-decrease.svg" alt="Decrease" onClick={subtractProduct}/>
                                        <div className={style.counter__info}>
                                            <p className={style.counter__count}>
                                                {countProduct} шт.
                                            </p>
                                        </div>
                                        <img className={style.counter__image} src="/assets/product-cart-increase.svg" alt="Increase" onClick={addProduct}/>
                                    </div>  
                                    :
                                    <button className={style.btn_add} onClick={count !== 0 && clickBtnAdd}>
                                        {
                                            count == 0 ?
                                            <p>Нет в наличии</p>
                                            :
                                            <p>В корзину</p>
                                        }
                                    </button>
                                }
                            </div>
                            <FavoriteHeart _id={_id} favorite={favorite}/> 
                        </div>
                    </>
                )
            }
        </div>
    );
}
 
export default Product;