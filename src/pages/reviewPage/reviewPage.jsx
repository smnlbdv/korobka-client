import { useEffect, useState, useContext } from 'react';
import { Link  } from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";
import Rating from '@mui/material/Rating'

import * as Yup from "yup";
import { useFormik } from "formik";
import ButtonCreate from "../../components/buttonCreate/buttonCreate.jsx";
import api from '../../api/api.js';

import style from './reviewPage.module.scss'

import ButtonNull from "../../components/buttonNull/buttonNull.jsx";

const ReviewPage = () => {

    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);
    const [hiddenBlock, setHiddenBlock] = useState(false);
    const [countImage, setCountImage] = useState(0);
    const [totalStars, setTotalStars] = useState(5);
    const [sliderImage, setSliderImage] = useState([]);
    const [productTitle, setProductTitle] = useState([]);
    const { id } = useParams();
    const { userId, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                await api.get(`/api/products/${id}`)
                          .then(response => {
                            setProductTitle(response.data.product.title);
                          })
                          .catch(error => alert(error.message))
              } catch (error) {
                console.log("Ошибка", error);
              }
        }
        fetchData()
    }, [])

    function previewImage(event) {
        const blockList = document.querySelector(`.${style.block__list__image}`)
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = function(event) {

            setSliderImage((prev) => [...prev, file])

            const newElement = document.createElement('div');
            const newImage = document.createElement('img');
            newImage.src = event.target.result;
            newImage.alt = 'Image slider';
            newImage.style.objectFit = 'cover'
            
            newImage.classList.add(`${style.item__select}`)
            newElement.appendChild(newImage);

            blockList.insertBefore(newElement, blockList.firstChild);
        };
    
        if (file) {
            if(countImage !== 5) {
                reader.readAsDataURL(file);
                setCountImage(countImage + 1)
            }
        }
    }

    const formikReview = useFormik({
        initialValues: {
          text: ""
        },
        validationSchema: Yup.object().shape({
          text: Yup.string().max(180, "Длина меньше 180 символов").min(50, "Длина не должна быть меньше 50").required("Поле не может быть пустым"),
          
        }),
        onSubmit: async (value) => {

            const formData = new FormData();
            formData.append('owner', userId);
            formData.append('product', id);
            formData.append('text', value.text);
            formData.append('stars', rating);

            for (let i = 0; i < sliderImage.length; i++) {
                formData.append('image', sliderImage[i]);
            }

            try {
                await api.post("/api/reviews/create/new-review", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                })
                .then(response => {
                    if(response.status == 201) {
                        setHiddenBlock(response.data.create)
                    }
                })
                .catch(response => {
                    if(response.response.status == 401) {
                        logout()
                        navigate("/api/auth/login");
                    }
                }); 
            }
            catch (error) {
                console.log(error.message)
            }

        },
    });

    return ( 
        <section className={`${style.section_review} wrapper`}>
            <div className={style.bg_review}></div>
            <ul className="bread-crumbs">
                <Link to="/">
                    <li>Главная</li>
                </Link>
                <li>Отзыв</li>
            </ul>
            {
                hiddenBlock ?
                <div className={style.hidden__block__inner}>
                    <img src="../../assets/party_popper.png" alt="Popper" />
                    <p>Отзыв успешно создан</p>
                    <div className={style.buttons_block}>
                        <ButtonNull title={"В каталог"} path={'/ready-gifts/all'}/>
                        <ButtonNull title={"Собрать"} path={'/constructor'}/>
                    </div>
                </div>
                :
                <div className={style.review__inner__block}>
                    <div className={style.left__block}>
                        <h2 className={`${style.section_title} section__title`}>Отзыв к товару: {productTitle} </h2>
                        <div className={style.main__block__review}>
                            <form onSubmit={formikReview.handleSubmit}>
                                <div className={style.inner__block__form}>
                                    <textarea
                                        className={style.input__text}
                                        id="text"
                                        name="text"
                                        value={formikReview.values.text}
                                        placeholder="Напишите немного о товаре"
                                        onChange={formikReview.handleChange}
                                        maxLength={180}
                                    ></textarea>
                                    <div className={style.block__lower}>
                                            {formikReview.errors.text && (
                                                <p className={style.error__message}>
                                                    {formikReview.errors.text}
                                                </p>
                                            )}
                                            <p className={style.count__letters}>{formikReview.values.text.length} / 180</p>
                                    </div>
                                </div>
                                <div className={style.main__block__stars}>
                                    <p>Оцените товар: </p>
                                    <Rating
                                        name="simple-controlled"
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setRating(newValue);
                                        }}
                                        />
                                </div>
                                <ButtonCreate
                                    text={"Сохранить"}
                                    type={"submit"}
                                    disabled={Object.keys(formikReview.errors).length > 0 }
                                />
                            </form>
                        </div>
                    </div>
                    <div className={style.block__select__image}>
                        <div className={style.block__review__right}>
                            <div className={style.header__list__image}>
                                <p className={style.block__select__title}>Прикрепите фото </p>
                                <p className={countImage == 5 && style.icon__image__full}>Выбрано: {countImage}/5</p>
                            </div>
                            <div className={style.block__list__image}>
                                <div className={style.item__select}>
                                    <label htmlFor="image"></label>
                                    <input type="file" name="image" accept="image/*" id="image" onChange={(event) => previewImage(event)}  disabled={countImage == 5 && true} />
                                    <div className={`${style.item__select__image} ${style.icon__image}`}>
                                        <img src="/assets/gallery-add.svg" alt="Icon clip"/>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            }
        </section>
     );
}
 
export default ReviewPage;