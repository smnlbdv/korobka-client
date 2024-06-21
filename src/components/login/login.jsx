import { useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import ButtonLogin from "../buttonLogin/buttonLogin.jsx";
import InputReg from "../inputReg/inputReg.jsx";
import style from "./login.module.scss";
import { AuthContext } from "../../context/authContext.js";

const Login = () => {
  const { postLogin, contextHolder } = useContext(AuthContext);

  const formikLogin = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Некорректный e-mail")
        .required("Обязательное поле"),
      password: Yup.string()
        .required("Обязательное поле")
        .min(5, "Минимальная длина пароля 5 символов"),
    }),
    onSubmit: async (values) => {
      try {
        postLogin(values)
      } catch (error) {
        alert(error);
      }
    },
  });

  const clearFieldByIdPass = (fieldId) => {
    formikLogin.setValues({
        ...formikLogin.values,
        [fieldId]: ""
    });
  };

  return (
    <div className={style.wrapper}>
      {contextHolder}
      <div className={style.block_reg}>
        <h2 className="section__title">Вход</h2>
        <form className={style.form} onSubmit={formikLogin.handleSubmit}>
          <InputReg
            id="email"
            value={formikLogin.values.email}
            img={"/assets/email-sign-up.svg"}
            name={"email"}
            type={"email"}
            placeholder={"E-mail"}
            onChange={formikLogin.handleChange}
            errorChange={formikLogin.errors.email && "true"}
            clearFieldById={clearFieldByIdPass}
          />
          <InputReg
            id="password"
            value={formikLogin.values.password}
            img={"/assets/lock-sign-up.svg"}
            name={"password"}
            type={"password"}
            placeholder={"Пароль"}
            chek={true}
            onChange={formikLogin.handleChange}
            errorChange={formikLogin.errors.password && "true"}
            clearFieldById={clearFieldByIdPass}
          />
          <ButtonLogin title={"Войти"} />
        </form>
        <nav className={style.navigation}>
          <div className={style.navigation__item}>
            <p className={style.navigation__text}>Нет профиля?</p>
            <a
              className={style.navigation__link}
              href="http://korobkabel.site/api/auth/registration"
            >
              Зарегистрироваться
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

export default Login;
