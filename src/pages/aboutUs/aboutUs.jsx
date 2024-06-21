/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

import style from "./aboutUs.module.scss";

const AboutUs = () => {
  return (
    <section className={`${style.section_about} wrapper`}>
      <ul className="bread-crumbs">
        <Link to="/">
          <li>Главная</li>
        </Link>
        <li>О нас</li>
      </ul>
      <h2 className={`${style.section__title_about} section__title`}>О нас</h2>
      <div className={style.block_about}>
        <div className={style.block_flex}>
          <p className={style.block__about_text}>
            Приветствуем вас на сайте Коробка - инновационной платформе, которая
            поможет вам сделать подарок по-настоящему особенным. У нас вы
            найдете уникальную возможность создавать индивидуальные подарочные
            наборы, которые идеально подойдут под характеристики и вкусы каждого
            человека.
          </p>
          <p className={style.block__about_text}>
            Мы понимаем, что выбор подарка может стать настоящей головной болью.
            Ведь каждый человек уникален, и мы верим, что подарок должен
            отражать именно его индивидуальность. Именно для этого мы создали
            Коробка- чтобы помочь вам подобрать подарок, который будет
            непременно вызывать улыбку и радость у вашего близкого человека.
          </p>
          <p className={style.block__about_text}>
            Наша команда профессионалов всегда готова помочь вам в выборе
            подарка и ответить на все ваши вопросы. Мы стремимся к тому, чтобы
            каждый клиент остался доволен нашим сервисом и нашими подарками.
          </p>
        </div>
        <div className={style.block__about_img}>
          <img src="./assets/about-us.jpg" alt="Team" />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
