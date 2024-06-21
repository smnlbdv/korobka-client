import { useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation} from 'swiper/modules';
import { useFormik } from 'formik';
import { Link } from "react-router-dom";
import * as Yup from 'yup';

import ButtonCreate from "../../components/buttonCreate/buttonCreate";
import StepsCard from "../../components/stepsCard/stepsCard";
import AnswerCard from "../../components/answerCard/answerCard";
import Product from "../../components/product/product";
import Review from "../../components/review/review";
import './ant.css'

import style from "./main.module.scss";
import "swiper/css";
import 'swiper/css/navigation';
import './../../libs/swiper.css'
import { AuthContext } from "../../context/authContext";

const stepsItem = [
  {
    img: "./assets/step-2.png",
    title: "Выбрать коробку",
    text: "На выбор даны 3 вида коробок",
  },
  {
    img: "./assets/step-3.png",
    title: "Стилизуйте коробку",
    text: "Можете изменить цвет и стиль коробки",
  },
  {
    img: "./assets/step-1.png",
    title: "Выбрать подарок",
    text: "Выберете товар среди более 1 тыс. товаров",
  },
  {
    img: "./assets/step-4.png",
    title: "Добавьте открытку",
    text: "Добавьте милую открытку",
  }
];

const answersWhy = [
  {
    id: 1,
    img: "./assets/answers-1.svg",
    title: "Лидер продаж 2023 года",
    text: "За 2023 год было продано более 10 тыс. коробок",
  },
  {
    id: 2,
    img: "./assets/answers-2.svg",
    title: "Быстрая доставка    ",
    text: "Мы предлагаем быструю и надежную доставку, чтобы ваш подарок пришел вовремя и без проблем",
  },
  {
    id: 3,
    img: "./assets/answers-3.svg",
    title: "Отличное обслуживание",
    text: "Наша команда всегда готова помочь вам с любыми вопросами или проблемами",
  },
  {
    id: 4,
    img: "./assets/answers-4.svg",
    title: "Качественный товар",
    text: "Все наши товары проходят строгий отбор, и мы работаем только с проверенными поставщиками",
  },
  {
    id: 5,
    img: "./assets/answers-5.svg",
    title: "Широкий ассортимент",
    text: "Мы предлагаем огромный выбор подарков для разных возрастов и интересов",
  },
];

const Main = () => {

  const [open, setOpen] = useState(3);
  const {contextHolder, newBoxList, sendEmailData, contextHolderEmail, reviewsList } = useContext(AuthContext);


  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Некорректный адрес электронной почты'),
    }),
    onSubmit: () => {
      if(formik.values.email == 0) {
        return false 
      } else {
        console.log(formik.values.email);
        sendEmailData(formik.values.email)
        formik.resetForm()
      }
    }
  });

  const openAnswer = (id) => {
    setOpen(id);
  };

  const clearFieldById = () => {
    formik.resetForm();
  };

  return (
    <section>
      <div className="wrapper">
      {contextHolder}
      {contextHolderEmail}
        <section className={style.main_section}>
            <div className={style.flex_box}>
              <div className={style.left_block}>
                <div className={style.text_block}>
                  <p>Собери свой</p>
                  <div className={style.block_yellow}>
                    <p className={style.text_up_yellow}>идеальный</p>
                    <span className={style.yellow_rectangle}></span>
                  </div>
                  <p>подарок</p>
                </div>
                <Link to="constructor">
                  <ButtonCreate text={"Собрать"} mainBlock={true} />
                </Link>
              </div>
              <div className={style.right_block}>
                <img
                  className={style.image_main}
                  src="/assets/main-img.png"
                  alt="surprise box"
                />
              </div>
            </div>
          </section>
          <section className={style.steps_block}>
            <h2 className="section__title">Как собрать подарок?</h2>
            <div className={style.steps_flex}>
              {stepsItem.map((item, index) => (
                <StepsCard
                  key={index}
                  img={item.img}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
            <Link to="constructor">
              <ButtonCreate text={"Собрать"} />
            </Link>
          </section>
          <section className={style.why_us}>
            <h2 className={`${style.section__title} section__title`}>Почему мы?</h2>
            <div className={`${style.answers_block} list_answer`}>
              {answersWhy.map((item, index) => (
                <AnswerCard
                  key={index}
                  id={item.id}
                  image={item.img}
                  title={item.title}
                  text={item.text}
                  openAnswer={openAnswer}
                  open={open}
                />
              ))}
            </div>
          </section>
          <section className={style.section_advertising}>
            <div className={style.left_block}>
              <h2 className={style.title_advertising}>Собери подарок сам!</h2>
              <p className={style.text}>
                Если ты ищешь подарок для своей лучшей подруги, что скажешь о
                стильной сумочке или браслете, который она сможет носить на любом
                мероприятии?
              </p>
              <div className={style.block__counter_two}>
                <Link to="constructor">
                  <ButtonCreate text={"Собрать"} />
                </Link>
              </div>
            </div>
            <div className={style.block_woman}>
              <img
                className={style.block_woman_image}
                src="/assets/woman-advertising.png"
                alt="woman"
              />
            </div>
          </section>
          <section className={style.new__list_box}>
            <h2 className="section__title">Новинки</h2>
            <div className={style.new_box_flex}>
              {newBoxList.map((item, index) => (
                <Product
                  key={index}
                  newProduct = {true}
                  {...item}
                />
              ))}
            </div>
          </section>
      </div>
      <div className={style.good_people}>
            <h2 className="section__title">Тысячи довольных пользователей</h2>
      </div>
      <div className={style.swiper}>
          <Swiper
            loop={true}
            effect={'coverflow'}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={1}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: -100,
              modifier: 1,
              slideShadows: true,
            }}
            navigation={true}
            modules={[EffectCoverflow, Navigation]}
            className="mySwiper-main mySwiperMain"
          >
            {
            reviewsList.map((item, index) => (
              <SwiperSlide key={index}>
                <Review img={item.owner.avatarUser} name={item.owner.name} stars={item.stars} lastName={item.owner.surname} text={item.text} data={item.date}/>
              </SwiperSlide>  
            ))
          }
          </Swiper>
        </div>
        <div className="wrapper">
          <section className={`${style.section_advertising} ${style.section_question}`}>
            <div className={style.question_block}>
                <form className={style.left_block_form} onSubmit={formik.handleSubmit}>
                  <h2 className={style.title_advertising}>Узнавайте первыми <br></br> о скидках и бонусах!</h2>
                  <p className={style.text}>
                    Подпишитесь и получайте полезные статьи и самые интересные предложения сети Korobka
                  </p>
                  <div className={formik.errors.email ? style.input_question_error : style.input_question}>
                    <input 
                      type="email"
                      name="email"
                      placeholder="Укажите почту..."
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                    <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearFieldById}/>
                  </div>
                  <div className={style.block__butoon__form}>
                    <ButtonCreate text={"Отправить"} type={"submit"}/>
                  </div>
                </form>
                <div className={style.block_woman}>
                  <img
                    className={style.block_woman_image}
                    src="/assets/mean-question.png"
                    alt="Woman"
                  />
                </div>
            </div>
          </section>
        </div>
    </section>
  );
};

export default Main;
