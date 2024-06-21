import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Progress } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';


import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import style from "./productPage.module.scss";
import { AuthContext } from "../../context/authContext.js";
import ButtonCreate from "../../components/buttonCreate/buttonCreate.jsx";
import FavoriteHeart from "../../components/favoriteHeart/favoriteHeart.jsx";

import api from "../../api/api.js";
import Review from "../../components/review/review.jsx";
import "./swiper.css"
import ButtonReview from "../../components/buttonReview/buttonReview.jsx";
import { useSelector } from "react-redux";
import Product from "../../components/product/product.jsx";
import Loading from "../../components/loading/loading.jsx";
import { Rating } from "@mui/material";

const ProductPage = () => {
  const [counterCart, setCounterCart] = useState(0);
  const [isCounter, setIsCounter] = useState(false);
  const [hiddenButton, setHiddenButton] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [similarItem, setSimilarItem] = useState([]);
  const [productReviews, setProductReviews] = useState([]);
  const { id } = useParams();
  const openBlock = useRef()
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { contextHolder, favoriteItem } = useContext(AuthContext);
  const mainImage = useRef();
  const cart = useSelector(state => state.cart.cart)
  const order = useSelector(state => state.profile.order)
  const [percent, setPercent] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [avgStars, setAvgStars] = useState(0)

  const customColors = {
    '0%': 'rgb(148, 0, 211)',
    '100%': 'rgb(148, 0, 211)',
  };

  useEffect(() => {
    if(selectedProduct.count == 0) {
      setIsDisabled(true)
    } else {
      setPercent((selectedProduct.count / 200) * 100)
    }
  }, [selectedProduct.count])

  const fetchData = async () => {
    try {
      await api.get(`/api/products/${id}`)
        .then((response) => {
          if (response.status == 200) {
            setSelectedProduct(response.data.product);
            setSimilarItem(response.data.similarProducts)
            setIsLoading(true)
          }
        })
        .catch((response) => {
          console.log(response.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const getCountProduct = () => {
    if (cart.length != 0) {
      cart.forEach((product, index) => {
        if (product._id === id) {
          setCounterCart(cart[index].count);
        }
      });
    }
  };

  const fetchReviewsProduct = async () => {
    try {
      await api
        .get(`/api/reviews/${id}`, {})
        .then((response) => {
          if (response.status == 200) {
            setProductReviews(response.data);
          }
        })
        .catch((response) => {
          console.log(response.message);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const totalStars = productReviews.reduce((total, item) => total + item.stars, 0);
    const totalReviews = productReviews.length;
    const averageStars = totalReviews > 0 ? totalStars / totalReviews : 0;
    
    setAvgStars(averageStars)
  }, [productReviews])

  useEffect(() => {
    setIsLoading(false)
    fetchData();
    fetchReviewsProduct();
    getCountProduct();

    const result = order.some(orderItem => 
      orderItem.items.some(item => item.productId._id === id)
    );

    setHiddenButton(result)

  }, [id]);

  useEffect(() => {
    const isExist = favoriteItem.some((product) => product._id == id);
    setIsFavorite(isExist)
  }, [id])

  useEffect(() => {
    const container = openBlock.current;

    const delegate = "[data-fancybox]";
    const options = {
      image: {
        maxWidth: "50%",
        maxHeight: "50%"
      }
    };

    NativeFancybox.bind(container, delegate, options);

    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };

  }, [id]);



  return (
    <section className={style.main__block_product}>
      {contextHolder}
      {
        !isLoading ?
        <Loading />
        :
        <div className="wrapper">
          <div className={style.block__adding__product}>
            <div className={style.product__image} ref={openBlock}>
                  <a href="#reviewSection">
                    <div className={style.stars_product}>
                      <Rating name="half-rating-read" defaultValue={avgStars} precision={0.5} readOnly size="medium"/>
                      <p>{avgStars.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})} {" "} • {" "} {productReviews.length} отзыва</p>
                    </div>
                  </a>
                  <a data-fancybox="gallery" href={selectedProduct.img}>
                    <div className={style.product__image_main}> 
                        <img
                            className={style.product__image_active}
                            ref={mainImage}
                            src={selectedProduct.img}
                            alt="Product image"
                          />
                    </div>
                  </a>
            </div>
            <div className={style.functions__card}>
              <div className={style.product__header}>
                <div className={style.header__left_block}>
                  <h2 className={style.title__product}>
                    {selectedProduct.title}
                  </h2>
                  <p className={style.price__product}>
                    {selectedProduct.price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})} BYN
                  </p>
                </div>
                <div className={style.header__right_block}>
                  <FavoriteHeart _id={id} favorite={isFavorite}/>
                </div>
              </div>
              <div className={style.instock__product}>
                <p>Осталось: {selectedProduct.count} шт.</p>
                <div className={style.bar_block}>
                  <Progress percent={percent} strokeWidth={7} showInfo={false} strokeColor={customColors} trailColor="rgba(245, 245, 245, 0.13);"/>
                </div>
              </div>
              <p className={style.text__product}>{selectedProduct.pageDesc}</p>
              <p className={style.quantity__product}>В корзине:{`  ${counterCart}`}</p>

              <div className={style.button__add__cart}>
                <ButtonCreate
                  disabled={isDisabled}
                  text={"Добавить"}
                  isCounter={isCounter}
                  setIsCounter={setIsCounter}
                  setCounterCart = {setCounterCart}
                  counterCart = {counterCart}
                  getCountProduct={getCountProduct}
                  button = {true}
                  _id={id}
                />
                {
                  hiddenButton && 
                  <ButtonReview id={id} />
                }
              </div>
              <div>
                <p className={style.title__messange}>
                  Расскажите об этом товаре друзьям
                </p>
                <div className={style.share__icon}>
                  <a className={style.share__icon__link} href="">
                    <img src="/assets/instagram-product.svg" alt="" />
                  </a>
                  <a className={style.share__icon__link} href="">
                    <img src="/assets/telegram-product.svg" alt="" />
                  </a>
                  <a className={style.share__icon__link} href="">
                    <img src="/assets/viber-product.svg" alt="" />
                  </a>
                  <a className={style.share__icon__link} href="">
                    <img src="/assets/vk-product.svg" alt="" />
                  </a>
                  <a className={style.share__icon__link} href="">
                    <img src="/assets/OK-product.svg" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={`${style.block__information} tabs`}>
            <div>
              <h2 className={style.description__title}>Описание товара</h2>
              <p className={style.text__information}>{selectedProduct.text}</p>
            </div>

            <div id="reviewSection">
              <h2 className={style.description__title}>Отзывы покупателей</h2>

              <div className={style.block__all_reviews}>
                {productReviews.length !== 0 ? (
                  productReviews.map((item, index) => (
                    <Review
                      id = {item._id}
                      key={item._id}
                      img={item.owner.avatarUser}
                      name={item.owner.name}
                      lastName={item.owner.surname}
                      text={item.text}
                      data={item.date}
                      stars={item.stars}
                      likes={item.likes}
                      reviewProduct={true}
                      slider={item.slider}
                      comment={item.comment}
                      hidden = {true}
                      isComment={true}
                    />
                  ))
                ) : (
                  <div className={style.block__null__product}>
                    <img src="/assets/null-reviews.png" alt="Null reviews" />
                    <p className={style.title_null_block}>У данного бокса нет отзывов</p>
                    <p className={style.sub_text}>Не упустите свой шанс! Закажите товар и оставьте отзыв.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
          <h2 className={style.description__title_similar}>Похожие товары</h2>
          <div className={style.similar__block}>
            <div className={style.liked__product__list}>
                {
                  <div className={style.favorite_items}>
                    <Swiper
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                      }}
                      loop={true}
                      slidesPerView={4}
                      pagination={{
                        clickable: true,
                      }}
                      navigation={false}
                      modules={[Autoplay, Pagination]}
                      className={`${style.mySwiper_cart} mySwiper_page`}
                    >
                      {
                        similarItem.map((obj, index) => 
                          <SwiperSlide key={obj._id}>
                            <Product
                              {...obj}
                            />
                          </SwiperSlide>
                        )
                      }
                    </Swiper>
                  </div>
                }
              </div>
            </div>
        </div>

      }
    </section>
  );
};

export default ProductPage;
