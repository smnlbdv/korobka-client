import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ButtonLogin from "../buttonLogin/buttonLogin.jsx";
import InputReg from "../inputReg/inputReg.jsx";
import style from "./resetPassword.module.scss";
import api from "../../api/api.js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../context/authContext.js";

const ResetPassword = () => {

  const { postTwoPassword, contextHolder } = useContext(AuthContext)
  const { token } = useParams();

  const formikReset = useFormik({
    initialValues: {
      password: "",
      twopassword: "",
    },
    validationSchema: Yup.object({
        password: Yup.string()
            .required("Обязательное поле")
            .min(5, "Пароль должен содержать не менее 6 символов"),
        twopassword: Yup.string()
            .required("Обязательное поле")
            .oneOf([Yup.ref("password"), null], "Пароли должны совпадать"), 
    }),
    onSubmit: async (values) => {
      postTwoPassword(values, token)
    }
  });

  return (
    <>
      {contextHolder}
      <div className={style.wrapper}>
        <div className={style.block_reg}>
          <h2 className="section__title">Обновить пароль</h2>
          <form className={style.form} onSubmit={formikReset.handleSubmit}>
            <InputReg
                id="password"
                value={formikReset.values.password}
                img={"/assets/lock-sign-up.svg"}
                name={"password"}
                type={"password"}
                placeholder={"Новый пароль"}
                onChange={formikReset.handleChange}
                errorChange={formikReset.errors.password && "true"}
                chek={true}
            />
            <InputReg
                id="twopassword"
                value={formikReset.values.twopassword}
                img={"/assets/lock-sign-up.svg"}
                name={"twopassword"}
                type={"password"}
                placeholder={"Повторите пароль"}
                onChange={formikReset.handleChange}
                errorChange={formikReset.errors.twopassword && "true"}
                chek={true}
            />
            <ButtonLogin title={"Отправить"} />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
