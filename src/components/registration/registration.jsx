import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/authContext.js";

import ButtonLogin from "../buttonLogin/buttonLogin.jsx";
import InputReg from "..//inputReg/inputReg.jsx";
import style from "./registration.module.scss";

const Registration = () => {

  const { postRegistration, contextHolder } = useContext(AuthContext)

  const formikRegistration = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Обязательное поле')
        .max(50, 'Превышено кол-во допустимых символов')
        .min(2, 'Слишком короткое имя'),
      surname: Yup.string()
          .required('Обязательное поле')
          .max(50, 'Превышено кол-во допустимых символов'),
      email: Yup.string()
          .email('Некорректный e-mail')
          .required('Обязательное поле'),
      password: Yup.string()
          .required('Обязательное поле')
          .min(5, 'Минимальная длина пароля 5 символов'),
      phone: Yup.string().matches(
        /^\+375 \([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
        "Неверный формат телефона",)
        .required('Обязательное поле')
    }),
    onSubmit: async (values) => {
        try {
            postRegistration(values)
        } catch (error) {
            alert(error);
        }
    },
  });

  const clearFieldByIdPass = (fieldId) => {
    formikRegistration.setValues({
        ...formikRegistration.values,
        [fieldId]: ""
    });
  };

  return (
    <div className={style.wrapper}>
      {contextHolder}
      <div className={style.block_reg}>
        <h2 className="section__title">Регистрация</h2>
        <form className={style.form} onSubmit={formikRegistration.handleSubmit}>
          <InputReg
            id="name"
            value={formikRegistration.values.name}
            img={"/assets/user-sign-up.svg"}
            name={"name"}
            type={"text"}
            placeholder={"Имя"}
            onChange={formikRegistration.handleChange}
            errorChange={formikRegistration.errors.name && "true"}
            clearFieldById={clearFieldByIdPass}
          />
          <InputReg
            id="surname"
            value={formikRegistration.values.surname}
            img={"/assets/user-sign-up.svg"}
            name={"surname"}
            type={"text"}
            placeholder={"Фамилия"}
            onChange={formikRegistration.handleChange}
            errorChange={formikRegistration.errors.surname && "true"}
            clearFieldById={clearFieldByIdPass}
          />
          <InputReg
            id="email"
            value={formikRegistration.values.email}
            img={"/assets/email-sign-up.svg"}
            name={"email"}
            type={"email"}
            placeholder={"E-mail"}
            onChange={formikRegistration.handleChange}
            errorChange={formikRegistration.errors.email && "true"}
            clearFieldById={clearFieldByIdPass}
          />
          <InputReg
            id="phone"
            value={formikRegistration.values.phone}
            img={"/assets/icon-call.svg"}
            name={"phone"}
            type={"text"}
            placeholder={"Номер телефона"}
            onChange={formikRegistration.handleChange}
            errorChange={formikRegistration.errors.phone && "true"}
            tel={"true"}
            clearFieldById={clearFieldByIdPass}
          />
          <InputReg
            id="password"
            value={formikRegistration.values.password}
            img={"/assets/lock-sign-up.svg"}
            name={"password"}
            type={"password"}
            placeholder={"Пароль"}
            onChange={formikRegistration.handleChange}
            errorChange={formikRegistration.errors.password && "true"}
            chek={true}
            clearFieldById={clearFieldByIdPass}
          />
          <ButtonLogin
            title={"Зарегистрироваться"}
          />
        </form>
        <nav className={style.navigation}>
          <div className={style.navigation__item}>
            <p className={style.navigation__text}>Есть профиль?</p>
            <a
              className={style.navigation__link}
              href="http://korobkabel.site/api/auth/login"
            >
              Войти
            </a>
          </div>
          <div className={style.navigation__item}>
            <p className={style.navigation__text}>Забыли пароль?</p>
            <a
              className={style.navigation__link}
              href="http://korobkabel.site/api/auth/forgot"
            >
              Сбросить пароль
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Registration;
