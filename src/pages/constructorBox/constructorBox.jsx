import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AuthContext } from "../../context/authContext.js";
import { flushSync } from "react-dom";
import * as uuid  from 'uuid';
import { ColorPicker } from 'antd';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import html2canvas from 'html2canvas';

import 'swiper/css';
import 'swiper/css/pagination';
import style from './constructorBox.module.scss'
import "../../index.scss"
import "./constructor.scss"

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import CardBox from '../../components/cardBox/cardBox.jsx';
import { useDispatch, useSelector } from 'react-redux';
import ItemConstructor from '../../components/itemConstructor/itemConstructor.jsx';
import debounce from 'debounce';
import api from '../../api/api.js';
import { calculatePrice, setPromoConstructor, setTotalPrice, setTitleOrder, setOrderObj, isSimpleBox, setImgUrl } from '../../store/prefabricatedGiftSlice.js';
import { resetOrderPush } from '../../store/cartSlice.js'
import { Link } from 'react-router-dom';

const ConstructorBox = () => {
    const [boxTypes, setBoxTypes] = useState()
    const [product, setProduct] = useState()
    const [postCard, setPostCard] = useState()
    const [sale, setSale] = useState({id: null, active: null, percentage: 0,});
    const itemsPrice = useSelector(state => state.prefabricatedGift.itemsPrice)
    const { getTypesBox, getProduct, getPostCard, contexHolder } = useContext(AuthContext)
    const dispatch = useDispatch()
    const productGift = useSelector(state => state.prefabricatedGift.product)
    const imageUrl = useSelector(state => state.prefabricatedGift.imageUrl)
    const typesBox = useSelector(state => state.prefabricatedGift.typesBox)
    const postcards = useSelector(state => state.prefabricatedGift.postcards)
    const totalPrice = useSelector(state => state.prefabricatedGift.totalPrice)
    const isSimple = useSelector(state => state.prefabricatedGift.simpleBox)
    const userId = useSelector(state => state.profile.userId)
    const title = useSelector(state => state.prefabricatedGift.title)
    const openImgTypes = useRef(null)
    const openImgProduct = useRef(null)
    const openImgPostCard = useRef(null)
    const [valuePostCard, setValuePostCard] = useState("")
    const [valueProduct, setValueProduct] = useState("")
    const [isDisabled, setIsDisabled] = useState(true)
    const [valueTypes, setValueTypes] = useState("")
    const [valuePromo, setValuePromo] = useState("")
    const [valueTitle, setValueTitle] = useState("")
    const [currentTexture, setCurrentTexture] = useState(null);
    const [colorHex, setColorHex] = useState('#1677ff');
    const [formatHex, setFormatHex] = useState('hex'); 
    const hexString = useMemo(
        () => (typeof colorHex === 'string' ? colorHex : colorHex?.toHexString()),
        [colorHex],
    );
    const nodeRef = useRef();

    const takeScreenshot = (node) => {
        html2canvas(node)
            .then(async (canvas) => {
                const image = canvas.toDataURL('image/png');
    
                const formData = new FormData();
                const imageFile = dataURLtoFile(image, 'image.png');
    
                formData.append('image-style', imageFile);
    
                try {
                    const response = await api.post('/api/constructor/style-image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    dispatch(setImgUrl("http://korobkabel.site:5000/style-box/" + response.data.fileName));
                } catch (error) {
                    console.error("Произошла ошибка", error);
                }
            })
            .catch((error) => {
                console.error("Произошла ошибка при создании скриншота", error);
            });
    };

    const dataURLtoFile = (dataURL, filename) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const [isColor, setIsColor] = useState(false)

    const filterProduct = product && product.filter(item => {
        return item.title.toLowerCase().includes(valueProduct.toLowerCase())
    })

    const filterPostCard = postCard && postCard.filter(item => {
        return item.title.toLowerCase().includes(valuePostCard.toLowerCase())
    })  

    const filterTypes = boxTypes && boxTypes.filter(item => {
        return item.title.toLowerCase().includes(valueTypes.toLowerCase())
    })  

    const clearInputPromo = () => {
        setValuePromo("")
    }

    const clearInputTitle = () => {
        setValueTitle("")
    }

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
                      active: response.response.data.active,
                      percentage: 0,
                    });
                  }
                });
            } catch (error) {
              console.log(error.message);
            }
        }
    }, 500);

    const clickConstructorButton = () => {
        const data = {
            owner: userId,
            typesBox: typesBox.map((type) => ({
                product: type._id,
                quantity: type.count,
                price: type.price,
                name: type.title
            })),
            product: productGift.map((prod) => ({
                product: prod._id,
                quantity: prod.count,
                price: prod.price,
                name: prod.title
            })),
            postcards: postcards.map((postcard) => ({
                product: postcard._id,
                quantity: postcard.count,
                price: postcard.price,
                name: postcard.title
            })),
            title: title || "Сборный подарок",
            image: imageUrl || "./assets/box-simple-box.png",
            price: totalPrice,
        };
        
        dispatch(setOrderObj(data))
        dispatch(resetOrderPush());
    }

    const clearInputTypes = () => {
        setValueTypes('')
    }

    const clearInputProduct = () => {
        setValueProduct('')
    }

    const clearInputPostCard = () => {
        setValuePostCard('')
    }

    const handleTextureClick = (texture) => {
        setCurrentTexture(texture);
    };

    const blockStyles = {
        backgroundImage: `url(${currentTexture})`,
        ...(isColor ? { backgroundColor: hexString } : {})
    };

    useEffect(() => {
        const result = sale.active === true
            ? (itemsPrice - itemsPrice * (sale.percentage / 100)).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})
            : itemsPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        
        if(sale.active) {
          dispatch(setPromoConstructor(sale));
        }
    
        dispatch(setTotalPrice(result))
        
    }, [itemsPrice, sale])

    useEffect(() => {
        dispatch(calculatePrice())
    }, [productGift, typesBox, postcards]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const types = await getTypesBox();
                const productRes = await getProduct()
                const postCardRes = await getPostCard()

                setProduct(productRes)
                setBoxTypes(types);
                setPostCard(postCardRes)
            } catch (error) {
                console.error('Произошла ошибка:', error);
            }
        };
        fetchData();
    }, []);
    
    useEffect(() => {
        const containerTypes = openImgTypes.current;
        const containerProduct = openImgProduct.current;
        const containerPostCard = openImgPostCard.current;
    
        const delegate = "[data-fancybox]";
        const options = {};
    
        NativeFancybox.bind(containerTypes, delegate, options);
        NativeFancybox.bind(containerProduct, delegate, options);
        NativeFancybox.bind(containerPostCard, delegate, options);
    
        return () => {
          NativeFancybox.unbind(containerTypes);
          NativeFancybox.close();
        };
    }, []);

    useEffect(() => {
        if(typesBox.length !== 0 || productGift.length !== 0 || postcards.length !== 0) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }

    }, [productGift, typesBox, postcards])

    return ( 

        <section className={`${style.section_constructor} wrapper`}>
            
            <Swiper
                direction={'vertical'}
                slidesPerView={1}
                pagination={{
                    clickable: true,
                }}
                allowTouchMove={false}
                modules={[Pagination]}
                className={`${style.customSwiper} ${isSimple ? "mySwiper-constructor" : "mySwiper-constructor-style"}`}
            >
                <SwiperSlide className={style.customSlide}>
                    <div className={style.header__slider}>
                        <h2 className='section__title'>Коробки</h2>
                        <div className={style.search__input}>
                            <img src="/assets/search.svg" alt=""/>
                            <input type="text" placeholder='Введите название открытки' value={valueTypes} onChange={(e) => setValueTypes(e.target.value)}/>
                            <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInputTypes}/>
                        </div>
                    </div>
                    <div className={style.customSlide__list__types} ref={openImgTypes}>
                    {
                        filterTypes && filterTypes.reverse().map((item, index) => (
                            <CardBox key={item._id} obj={item} type={"boxTypes"} simpleBox={isSimple}/>
                        ))
                    }
                    </div>
                </SwiperSlide>
                {
                    isSimple &&
                    <SwiperSlide className={`${style.customSlide} ${style.customSlide2} swiper-rexture`}>
                        <div className={style.back_block} ref={nodeRef}>
                            <div className={style.three_d_box}>
                                <div className={style.front} style={blockStyles}></div>
                                <div className={style.back} style={blockStyles}></div>
                                <div className={style.left} style={blockStyles}></div>
                                <div className={style.right} style={blockStyles}></div>
                                <div className={style.top} style={blockStyles}></div>
                                <div className={style.bottom} style={blockStyles}></div>
                            </div>
                        </div>
                        <div className={style.list_textures}>
                            <ColorPicker
                                format={formatHex}
                                onChange={(e) => {
                                    setColorHex(e)
                                    setIsColor(true);
                                }}
                                onFormatChange={setFormatHex}
                                className={style.color_picker}
                            />
                            <div className={style.block__button}>
                                <button className={style.button} onClick={() => takeScreenshot(nodeRef.current)}>Сохранить</button>
                                <button className={style.button} onClick={() => {
                                    setCurrentTexture(null)
                                    setColorHex("")
                                }}>Сбросить</button>
                            </div>
                            <Swiper
                                loop={true}
                                slidesPerView={5}
                                allowTouchMove={true}
                                navigation={true}
                                className="inner_swiper_style"
                                modules={[Navigation, Autoplay]}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                            >
                                {
                                    Array(7).fill().map((_, index) => (
                                        <SwiperSlide key={index}>
                                            <div className={style.texture_block}>
                                                <img src={`../assets/textures/textures-${index+1}.png`} alt="Texture" onClick={() => handleTextureClick(`../assets/textures/textures-${index+1}.png`)}/>
                                            </div>
                                        </SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        </div>
                        
                </SwiperSlide>
                }
                <SwiperSlide className={style.customSlide}>
                    <div className={style.header__slider}>
                        <h2 className='section__title'>Товары</h2>
                        <div className={style.search__input}>
                            <img src="/assets/search.svg" alt=""/>
                            <input type="text" placeholder='Введите название товара'  value={valueProduct} onChange={(e) => setValueProduct(e.target.value)}/> 
                            <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInputProduct}/> 
                        </div>
                    </div>
                    <div className={style.customSlide__list__types} ref={openImgProduct}>
                        {
                            filterProduct && filterProduct.map((item, index) => (
                                <CardBox key={item._id} obj={item} type={"product"}/>
                            ))
                        }
                    </div>
                </SwiperSlide>
                <SwiperSlide className={style.customSlide}>
                    <div className={style.header__slider}>
                        <h2 className='section__title'>Открытки</h2>
                        <div className={style.search__input}>
                            <img src="/assets/search.svg" alt=""/>
                            <input type="text" placeholder='Введите название открытки' value={valuePostCard} onChange={(e) => setValuePostCard(e.target.value)}/>  
                            <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInputPostCard}/>
                        </div>
                    </div>
                    <div className={style.customSlide__list__types} ref={openImgPostCard}>
                        {
                            filterPostCard && filterPostCard.map((item, index) => (
                                <CardBox key={item._id} obj={item} type={"postCard"}/>
                            ))
                        }
                    </div>
                </SwiperSlide>
                <SwiperSlide className={style.customSlide}>
                    <div className={style.check__block}>
                        {
                            (typesBox.length !== 0 || productGift.length !== 0 || postcards.length !== 0) ? (
                                <>
                                    <div className={style.block__total_price}>
                                        <h3 className={style.title}>Ваш заказ</h3>
                                        <div className={style.cart__info}>
                                            <div className={style.info__item}>
                                                <p>Кол-во:</p>
                                                <p>
                                                    {typesBox.length + productGift.length + productGift.length}{" "}
                                                    шт.
                                                </p>
                                            </div>
                                            <div className={style.info__item}>
                                                <p>Сумма:</p>
                                                <p>{itemsPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})} BYN</p>
                                            </div>
                                            <div className={style.info__item}>
                                                <p>Скидка:</p>
                                                <p>{sale.percentage} %</p>
                                            </div>
                                        </div>
                                        <div className={`${style.promo} ${
                                                    sale.active === true
                                                    ? style.promo__active__true
                                                    : sale.active === false
                                                    ? style.promo__active__false
                                                    : sale.active === null
                                                    ? ' '
                                                    : ''
                                                }`}>
                                            <input
                                                type="text"
                                                value={valuePromo}
                                                placeholder="Промокод..."
                                                onChange={(e) => {
                                                    setValuePromo(e.target.value)
                                                }}
                                                onInput={(event) =>  {
                                                    if (event.target.value.trim().length > 1) {
                                                        delayedSearch(event.target.value);
                                                    } else {
                                                        setSale({
                                                            active: null,
                                                            percentage: 0
                                                        });
                                                    }
                                                }}
                                            />
                                            <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInputPromo}/>
                                        </div>
                                        <div className={style.title_order}>
                                            <input
                                                type="text"
                                                value={valueTitle}
                                                placeholder="Название подарка..."
                                                onInput={(event) =>  {
                                                    dispatch(setTitleOrder(event.target.value))
                                                }}
                                                onChange={(e) => {
                                                    setValueTitle(e.target.value)
                                                }}
                                            />
                                            <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInputTitle}/>
                                        </div>
                                        <div className={style.pay}>
                                            <div className={style.pay_item}>
                                            <p>Итог к оплате: </p>
                                            <p className={style.totalPrice}>
                                                {totalPrice} BYN
                                            </p>
                                            </div>
                                            <Link to="/cart/order">
                                                <button className={style.btn_checkout} disabled={isDisabled} onClick={clickConstructorButton}>Оформить</button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className={style.customSlide__list__items}>
                                        {typesBox && typesBox.slice().reverse().map((item, index) => (
                                            <ItemConstructor key={item._id} _id={item._id} photo={item.photo} title={item.title} price={item.price} count={item.count} setSimpleBox={isSimple}/>
                                        ))}
                                        {productGift && productGift.slice().reverse().map((item, index) => (
                                            <ItemConstructor key={item._id} _id={item._id} photo={item.photo} title={item.title} price={item.price} count={item.count}/>
                                        ))}
                                        {postcards && postcards.slice().reverse().map((item, index) => (
                                            <ItemConstructor key={item._id} _id={item._id} photo={item.photo} title={item.title} price={item.price} count={item.count}/>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={style.null_block_constructor}>
                                    <div>
                                        <p className={style.text__big}>У вас нет добавленных товаров</p>
                                        <p className={style.text__little}>Добавьте новый товар сейчас!!</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </SwiperSlide>
            </Swiper>

        </section>
     );
}
 
export default ConstructorBox;