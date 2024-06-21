import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";
import { useFormik } from "formik";
import { Radio } from 'antd';
import { deleteCartItemAsync, orderPushItems, setPromoAsync} from "../../store/cartSlice.js";
import { addProductProfile, addConstructorProfile } from "../../store/profileSlice.js";
import { useDispatch, useSelector } from "react-redux";

import * as Yup from "yup";
import style from './orderPage.module.scss'

import InputProfile from "../../components/inputProfile/inputProfile";
import ButtonCreate from "../../components/buttonCreate/buttonCreate";
import OrderItem from "../../components/orderItem/orderItem.jsx";
import ButtonNull from "../../components/buttonNull/buttonNull.jsx";
import { placeOrderAsync } from "../../store/profileSlice.js";
import OrderConstructorItem from "../../components/orderConstructorItem/orderConstructor.jsx";
import { placeOrderConstructorAsync, fullDeleteItemConstructor, isSimpleBox } from "../../store/prefabricatedGiftSlice.js";

const OrderPage = () => {
    const [url, setUrl] = useState('#')
    const { contextHolder, downloadCheck, pay, orderCheckout, calculatePrice, openNotification, openNotificationError } = useContext(AuthContext);
    const cart = useSelector(state => state.cart.cart)
    const checkArray = useSelector(state => state.cart.checkArray)
    const profile = useSelector(state => state.profile.profile)
    const orderArray = useSelector(state => state.cart.order)
    const promo = useSelector(state => state.cart.promo)
    const promoConstructor = useSelector(state => state.prefabricatedGift.promo)
    const orderObj = useSelector(state => state.prefabricatedGift.orderObj)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const totalPrice = useSelector(state => state.cart.totalPrice)
    
    const postOrderItems = async (order, values, promo, totalAmount) => {
        let originalFormat = typeof(totalAmount) === 'string' ? parseFloat(totalAmount.replace(/\s/g, '').replace(',', '.')) : totalAmount;
        if(values) {
            dispatch(placeOrderAsync({values, order, price: originalFormat}))
                    .then((response) => {
                        setUrl(response.payload.url);

                        if(promo && promo.percentage !== 1) {
                            dispatch(setPromoAsync(promo.id))
                        }

                        dispatch(addProductProfile(response.payload.order))
                        dispatch(orderPushItems([]))
                        
    
                        if(checkArray.length > 0) {
                            order.forEach((item) => {
                                dispatch(deleteCartItemAsync(item._id));
                            });
                        } else {
                            order.map((item) => {
                                dispatch(deleteCartItemAsync(item._id));
                            });
                        }
                    })
                    .catch((response) => {
                        openNotificationError("bottomRight", "Ошибка оформления заказа");
                        setTimeout(() => {
                            navigate("/cart");
                        }, 1000)
                    })
        }
    }

    const postOrderConstructor = async (order, values, promo) => {
        let originalFormat = typeof(order.price) === 'string' ? parseFloat(order.price.replace(/\s/g, '').replace(',', '.')) : order.price;
        if(values) {
            dispatch(placeOrderConstructorAsync({values, order, price: originalFormat}))
                    .then((response) => {
                        setUrl(response.payload.url);

                        if(promo && promo.percentage !== 1) {
                            dispatch(setPromoAsync(promo.id))
                        }

                        dispatch(addConstructorProfile(response.payload.order))
                        dispatch(fullDeleteItemConstructor([]))
                        dispatch(isSimpleBox(false))
                    })
                    .catch((response) => {
                        openNotificationError("bottomRight", "Ошибка оформления заказа");

                        setTimeout(() => {
                            navigate("/constructor");
                        }, 1000)
                    })
        }
    }

    const formikOrder = useFormik({
        initialValues: {
          address: "",
          name: "",
          lastname: "",
          phone: "",
          email: "",
          wayPay: ""
        },
        validationSchema: Yup.object({
          address: Yup.string().required("Обязательное поле").max(50,"Превышено кол-во допустимых символов"),
          name: Yup.string().required("Обязательное поле").max(50,"Превышено кол-во допустимых символов"),
          lastname: Yup.string().required("Обязательное поле").max(50,"Превышено кол-во допустимых символов"),
          email: Yup.string().email("Некорректный e-mail").required("Обязательное поле"),
          wayPay: Yup.string().required("Обязательное поле"),
          phone: Yup.string()
            .matches(
              /^\+375 \([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
              "Неверный формат телефона"
            )
            .required("Обязательное поле"),
        }),
        onSubmit: async (values, {resetForm}) => {
            const way = pay.find(item => item._id === values.wayPay)

            if(way.name === "Картой") {
                if(orderObj.length !== 0) {
                    orderCheckout(orderObj, values, null, orderObj[0].price, true)  
                } else {
                    orderCheckout(orderArray, values, promo, totalPrice)
                }
            } else {
                if(orderObj.length !== 0) {
                    postOrderConstructor(orderObj[0], values, promoConstructor)
                    resetForm()
                } else {
                    postOrderItems(orderArray, values, promo, totalPrice)
                    resetForm()
                }
            }

        },
    });
    
    useEffect(() => {
        if (profile.length !== 0) {
            formikOrder.setValues({
              name: profile.name,
              lastname: profile.surname,
              email: profile.email,
              phone: profile.phone,
            })
        }

    }, [])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentSuccess = urlParams.get('payment_success');

        if (paymentSuccess === 'true') {
            const order = JSON.parse(localStorage.getItem('order'))
            const initialValues = JSON.parse(localStorage.getItem('initialValues'))
            const promo = JSON.parse(localStorage.getItem('promo'))
            const totalAmount = JSON.parse(localStorage.getItem('totalAmount'))
            const constructor = JSON.parse(localStorage.getItem('constructor'))

            if(order && constructor) {
                postOrderConstructor(order[0], initialValues, promo)
            } else if(cart && cart.length >= 0 && checkArray && checkArray.length >= 0) {
                postOrderItems(order, initialValues, promo, totalAmount);
            }

            localStorage.removeItem('initialValues')
            localStorage.removeItem('order')
            localStorage.removeItem('promo')
            localStorage.removeItem('totalAmount')
            localStorage.removeItem('constructor')
        }
    }, []);

    return ( 
        <section className={`${style.section_cart} wrapper`}>
            {contextHolder}
            <div className={style.bg_order}></div>
            <ul className="bread-crumbs">
                <Link to="/">
                    <li>Главная</li>
                </Link>
                <Link to="/cart">
                    <li>Корзина</li>
                </Link>
                <li>Оформление заказа</li>
            </ul>
            <h2 className={`${style.section_title} section__title`}>Оформление заказа</h2>
            {
                orderArray.length !== 0 || orderObj.length !==0  ?
                <div className={style.block__orders}>
                    <div className={style.block__form}>
                        <form
                            onSubmit={formikOrder.handleSubmit}
                            className={style.personal__data}
                            >
                            <div className={style.personal__input__block}>
                                <div className={style.block__fullname}>
                                    <div className={style.input__block}>
                                        <p className={style.input__title}>Имя *</p>
                                        <InputProfile
                                            id="name"
                                            name="name"
                                            typeInput={"text"}
                                            value={formikOrder.values.name}
                                            onChange={formikOrder.handleChange}
                                            placeholder={"Имя"}
                                            errorChange = {formikOrder.errors.name && "true"}
                                        />
                                    </div>
                                    <div className={style.input__block}>
                                        <p className={style.input__title}>Фамилия *</p>
                                        <InputProfile
                                            id="lastname"
                                            name="lastname"
                                            typeInput={"text"}
                                            value={formikOrder.values.lastname}
                                            onChange={formikOrder.handleChange}
                                            placeholder={"Фамилия"}
                                            errorChange = {formikOrder.errors.lastname && "true"}
                                        />
                                    </div>
                                </div>
                                <div className={style.input__block}>
                                        <p className={style.input__title}>Email*</p>
                                        <InputProfile
                                            id="email"
                                            name="email"
                                            typeInput={"text"}
                                            value={formikOrder.values.email}
                                            onChange={formikOrder.handleChange}
                                            placeholder={"E-mail"}
                                            errorChange = {formikOrder.errors.email && "true"}
                                        />
                                    </div>
                                <div className={style.input__block}>
                                    <p className={style.input__title}>
                                        Адрес *
                                    </p>
                                    <InputProfile
                                        id="address"
                                        name="address"
                                        typeInput={"text"}
                                        value={formikOrder.values.address}
                                        onChange={formikOrder.handleChange}
                                        placeholder={"Адрес доставки"}
                                        errorChange = {formikOrder.errors.address && "true"}
                                    />
                                </div>
                                <div className={style.input__block}>
                                    <p className={style.input__title}>
                                        Номер телефона *
                                    </p>
                                    <InputProfile
                                        id="phone"
                                        name="phone"
                                        typeInput={"tel"}
                                        placeholder={"Номер телефона"}
                                        value={formikOrder.values.phone}
                                        onChange={formikOrder.handleChange}
                                        errorChange = {formikOrder.errors.phone && "true"}
                                        tel = {"true"}
                                    />
                                </div>
                                <div className={style.input__block}>
                                    <p className={style.input__title}>Выберите способ оплаты *</p>
                                    <div className={style.block__pay}>
                                        <Radio.Group id="wayPay" name="wayPay" onChange={formikOrder.handleChange} defaultValue={undefined}>
                                            {
                                                pay.map((obj, index) => (
                                                    <Radio key={index} value={obj._id}>
                                                        <p className={style.way_pay}>{obj.name}</p>
                                                    </Radio>
                                                ))
                                            }
                                        </Radio.Group>
                                    </div>
                                </div>
                            </div>
                            <p className={style.required__title}>* - поля обязательные для заполнения</p>
                            <div className={style.button__save}>
                                <ButtonCreate text={"Заказать"} type={"submit"} disabled={Object.keys(formikOrder.errors).length > 0}/>
                            </div>
                        </form>
                    </div>
                    <div className={style.block__order__items}>
                    {orderArray.length !== 0 ? 
                        orderArray.slice().reverse().map((obj, index) => (
                            <OrderItem
                                key={index}
                                {...obj}
                            />
                        )) 
                        : 
                        orderObj && orderObj.length !== 0 && (
                            orderObj.map((obj, index) => (
                                <OrderConstructorItem 
                                    key={index}
                                    img={obj.image}
                                    title={obj.title}
                                    price={obj.price}
                                    count={1}
                                />
                            )
                        )
                    )}
                    </div>
                </div>
                :
                <div className={style.block__successStatus}>
                    <div className={style.inner__block__success}>
                        <img className={style.block__successStatus__image} src="../../assets/party_popper.png" alt="Popper" />
                        <p className={style.block__successStatus__text}>Заказ успешно оформлен</p>
                        <div className={style.block__buttons}>
                            <ButtonNull title={"В каталог"} path={'/ready-gifts/all'}/>
                            <a className={style.button__check} href={url} target="_blank" rel="noopener noreferrer">Чек</a>
                        </div>
                    </div>
                </div>
            }
        </section>
     );
}
 
export default OrderPage;