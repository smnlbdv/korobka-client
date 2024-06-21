/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.js";
import { useFormik } from "formik";
import { Tabs, Modal } from "antd";
import * as Yup from "yup";
import { addInfoProfile, updateInfoProfileAsync } from "../../store/profileSlice.js";

import "./ant.css";

import ButtonNull from "../../components/buttonNull/buttonNull.jsx";
import InputProfile from "../../components/inputProfile/inputProfile.jsx";
import style from "./profile.module.scss";
import ButtonCreate from "../../components/buttonCreate/buttonCreate.jsx";
import ProfileOrdersBlock from "../../components/profileOrderBlock/profileOrderBlock.jsx";
import ModalProfileItem from "../../components/modalProdileItem/modalProfileItem.jsx";
import { useDispatch, useSelector } from "react-redux";
import ProfileOrderConstructor from "../../components/profileOrderConstructor/profileOrderConstructor.jsx";
import ModalItemConstructor from "../../components/modalItemConstructor/modalItemConstructor.jsx";

const Profile = () => {
  const {
    uploadAvatar,
    getProfile,
    logout,
    contextHolder,
    updatePassUser,
    openNotification,
    openNotificationError
  } = useContext(AuthContext);
  const inputFileRef = useRef(null);
  const inputNewPass = useRef(null);
  const inputPrePass = useRef(null);
  const inputDoublePass = useRef(null);
  const [initialData, setInitialData] = useState({});
  const [typeInputPass, setTypeInputPass] = useState("password");
  const [titleHiddenButton, setTitleHiddenButton] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenConstructor, setIsModalOpenConstructor] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsConstructor, setSelectedItemsConstructor] = useState([]);
  const profile = useSelector(state => state.profile.profile)
  const order = useSelector(state => state.profile.order)
  const constructor = useSelector(state => state.profile.constructor)
  const dispatch = useDispatch()

  const showModal = (_id) => {
    setIsModalOpen(true);
    
    order.forEach((orderItem) => {
      if(String(orderItem._id) === String(_id)) {
        setSelectedItems([...orderItem.items]);
      }
    })
    
  };

  const showModalConstructor = (_id) => {
    setIsModalOpenConstructor(true);

    constructor.forEach((orderItem) => {
      if(orderItem.typesBox) {
          orderItem.typesBox.forEach((boxItem) => {
              if (!selectedItemsConstructor.includes(boxItem)) {
                  setSelectedItemsConstructor((prevSelectedItems) => [...prevSelectedItems, boxItem]);
              }
          });
      }
  
      if(orderItem.product) {
          orderItem.product.forEach((productItem) => {
              if (!selectedItemsConstructor.includes(productItem)) {
                  setSelectedItemsConstructor((prevSelectedItems) => [...prevSelectedItems, productItem]);
              }
          });
      }
  
      if(orderItem.postcards) {
          orderItem.postcards.forEach((postcardItem) => {
              if (!selectedItemsConstructor.includes(postcardItem)) {
                  setSelectedItemsConstructor((prevSelectedItems) => [...prevSelectedItems, postcardItem]);
              }
          });
      }
  });
    
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalOpenConstructor(false)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenConstructor(false)
  };

  const hiddenPass = (e) => {
    e.preventDefault();
    if (typeInputPass == "password") {
      setTypeInputPass("text");
      setTitleHiddenButton(false);
    } else {
      setTypeInputPass("password");
      setTitleHiddenButton(true);
    }
  };

  const formikPass = useFormik({
    initialValues: {
      prepassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().min(5, "Длинна меньше 5 символов"),
      prepassword: Yup.string().min(5, "Длинна меньше 5 символов"),
      confirmPassword: Yup.string()
        .min(5, "Длинна меньше 5 символов")
        .oneOf([Yup.ref("password"), null], "Пароли не совпадают"),
    }),
    onSubmit: (values, { setFieldError, resetForm }) => {
      if (
        values.prepassword != 0 &&
        values.password != 0 &&
        values.confirmPassword != 0
      ) {
        updatePassUser(values)
          .then((response) => {
            if (!response) {
              setFieldError("prepassword", "Неверный пароль");
            } else {
              resetForm();
            }
          });
      } else {
        if (!values.prepassword) {
          setFieldError("prepassword", "Введите значение");
        }
        if (!values.password) {
          setFieldError("password", "Введите значение");
        }
        if (!values.confirmPassword) {
          setFieldError("confirmPassword", "Введите значение");
        }
      }
    },
  });

  function compareObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  const clearFieldById = (fieldId) => {
    formikPersonal.setValues({
        ...formikPersonal.values,
        [fieldId]: ""
    });
  };

  const clearFieldByIdPass = (fieldId) => {
    formikPass.setValues({
        ...formikPersonal.values,
        [fieldId]: ""
    });
  };

  const formikPersonal = useFormik({
    initialValues: {
      name: profile.name || "",
      surname: profile.surname || "",
      phone: profile.phone || "",
      email: profile.email || "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Обязательное поле")
        .max(50, "Превышено кол-во допустимых символов")
        .min(3, "Слишком короткое имя"),
      surname: Yup.string()
        .required("Обязательное поле")
        .max(50, "Превышено кол-во допустимых символов"),
      email: Yup.string()
        .email("Некорректный e-mail")
        .required("Обязательное поле"),
      phone: Yup.string().matches(
        /^\+375 \([0-9]{2}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/,
        "Неверный формат телефона")
        .required("Обязательное поле")
    }),
    onSubmit: (values) => {
      if (!compareObjects(initialData, values)) {
        
        const formData = {
          ...values
        };

        const commonKeys = Object.keys(profile).filter(key => Object.prototype.hasOwnProperty.call(formData, key));
    
        const diffValues = commonKeys.reduce((result, key) => {
            if (profile[key] !== formData[key]) {
                result[key] = formData[key];
            }
            return result;
        }, {});

        dispatch(updateInfoProfileAsync(diffValues))
              .then(() => {
                openNotification("bottomRight", "Данные успешно измененны")
                setInitialData(diffValues); 
              })
              .catch(() => {
                openNotificationError("bottomRight", "Ошибка сохранения данных")
              })
      }
    },
  });

  const changeUserName = (e) => {
    formikPersonal.handleChange(e);
  };

  useEffect(() => {
    if (profile.length === 0) {
      getProfile();
    } else {
      const newData = {
        name: profile.name,
        surname: profile.surname,
        phone: profile.phone,
        email: profile.email,
      };
      setInitialData(newData); 
    }
  }, []);

  const orderItemsTabs = [
    {
      key: "1",
      label: "Готовые боксы",
      children: (
        <div>
          {order.length !== 0 ? (
              <ProfileOrdersBlock showModal={showModal} />
            ) : (
              <div className={style.profile__block_null}>
                <div className={style.block__info}>
                  <p className={style.title}>У вас нет заказов</p>
                  <div className={style.btn_block}>
                    <ButtonNull title={"В каталог"} path={"/ready-gifts/all"} />
                    <ButtonNull title={"Собрать"} path={"/"} />
                  </div>
                </div>
              </div>
            )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Сборные заказы",
      children: (
        <div>
          {constructor.length !== 0 ? (
              <div className={style.block__orders}>
                {constructor.slice().reverse().map((obj, index) => (
                    <ProfileOrderConstructor
                        key={obj._id}
                        {...obj}
                        onClick={showModalConstructor}
                    />
                ))}
              </div>
            ) : (
              <div className={style.profile__block_null}>
                <div className={style.block__info}>
                  <p className={style.title}>У вас нет заказов</p>
                  <div className={style.btn_block}>
                    <ButtonNull title={"В каталог"} path={"/ready-gifts/all"} />
                    <ButtonNull title={"Собрать"} path={"/"} />
                  </div>
                </div>
              </div>
            )}
        </div>
      ),
    },
  ];

  const itemsTabs = [
    {
      key: "1",
      label: "Личные данные",
      children: (
        <form
          onSubmit={formikPersonal.handleSubmit}
          className={style.personal__data}
        >
          <div className={style.personal__input__block}>
            <div className={style.input__block}>
              <p className={style.input__title}>Имя *</p>
              <InputProfile
                id="name"
                name="name"
                typeInput={"text"}
                value={formikPersonal.values.name}
                placeholder={"Имя"}
                onChange={changeUserName}
                errorChange={formikPersonal.errors.name && "true"}
                clearFieldById={clearFieldById}
              />
              {formikPersonal.errors.name && (
                <p className={style.error__message}>
                  {formikPersonal.errors.name}
                </p>
              )}
            </div>
            <div className={style.input__block}>
              <p className={style.input__title}>Фамилия *</p>
              <InputProfile
                id="surname"
                name="surname"
                typeInput={"text"}
                value={formikPersonal.values.surname}
                onChange={formikPersonal.handleChange}
                placeholder={"Фамилия"}
                errorChange={formikPersonal.errors.surname && "true"}
                clearFieldById={clearFieldById}
              />
              {formikPersonal.errors.surname && (
                <p className={style.error__message}>
                  {formikPersonal.errors.surname}
                </p>
              )}
            </div>
          </div>
          <div className={style.personal__input__block}>
            <div className={style.input__block}>
              <p className={style.input__title}>E-mail *</p>
              <InputProfile
                id="email"
                name="email"
                typeInput={"text"}
                placeholder={"E-mail"}
                value={formikPersonal.values.email}
                onChange={formikPersonal.handleChange}
                errorChange={formikPersonal.errors.email && "true"}
                clearFieldById={clearFieldById}
              />
              {formikPersonal.errors.email && (
                <p className={style.error__message}>
                  {formikPersonal.errors.email}
                </p>
              )}
            </div>
            <div className={style.input__block}>
              <p className={style.input__title}>Номер телефона *</p>
              <InputProfile
                id="phone"
                name="phone"
                typeInput={"text"}
                placeholder={"Номер телефона"}
                value={formikPersonal.values.phone}
                onChange={formikPersonal.handleChange}
                errorChange={formikPersonal.errors.phone && "true"}
                tel={"true"}
                clearFieldById={clearFieldById}
              />
              {formikPersonal.errors.phone && (
                <p className={style.error__message}>
                  {formikPersonal.errors.phone}
                </p>
              )}
            </div>
          </div>
          <p className={style.required__title}>
            * - поля обязательные для заполнения
          </p>
          <div className={style.button__save}>
            <ButtonCreate
              text={"Сохранить"}
              type={"submit"}
              disabled={Object.keys(formikPersonal.errors).length > 0}
            />
          </div>
        </form>
      ),
    },
    {
      key: "2",
      label: "Сброс пароля",
      children: (
        <form
          className={style.personal__data}
          onSubmit={formikPass.handleSubmit}
        >
          <div className={style.personal__input__block}>
            <div className={style.input__block}>
              <p className={style.input__title}>Старый пароль</p>
              <InputProfile
                id="prepassword"
                name="prepassword"
                typeInput={typeInputPass}
                hiddenImage={true}
                value={formikPass.values.prepassword}
                url={"/assets/lock-sign-up.svg"}
                placeholder={""}
                onChange={formikPass.handleChange}
                ref={inputPrePass}
                errorChange={formikPass.errors.prepassword && "true"}
                clearFieldById={clearFieldByIdPass}
              />
              {formikPass.errors.prepassword && (
                <p className={style.error__message}>
                  {formikPass.errors.prepassword}
                </p>
              )}
            </div>
            <button className={style.button__hidden__pass} onClick={hiddenPass}>
              {titleHiddenButton ? "Показать пароли" : "Скрыть пароли"}
            </button>
          </div>
          <div className={style.personal__input__block}>
            <div className={style.input__block}>
              <p className={style.input__title}>Новый пароль</p>
              <InputProfile
                id="password"
                name="password"
                value={formikPass.values.password}
                onChange={formikPass.handleChange}
                typeInput={typeInputPass}
                hiddenImage={true}
                url={"/assets/lock-sign-up.svg"}
                placeholder={""}
                errorChange={formikPass.errors.password && "true"}
                ref={inputNewPass}
                clearFieldById={clearFieldByIdPass}
              />
              {formikPass.errors.password && (
                <p className={style.error__message}>
                  {formikPass.errors.password}
                </p>
              )}
            </div>
            <div className={style.input__block}>
              <p className={style.input__title}>Повторите пароль</p>
              <InputProfile
                id="confirmPassword"
                name="confirmPassword"
                value={formikPass.values.confirmPassword}
                onChange={formikPass.handleChange}
                typeInput={typeInputPass}
                hiddenImage={true}
                url={"/assets/lock-sign-up.svg"}
                placeholder={""}
                errorChange={formikPass.errors.confirmPassword && "true"}
                ref={inputDoublePass}
                clearFieldById={clearFieldByIdPass}
              />
              {formikPass.errors.confirmPassword && (
                <p className={style.error__message}>
                  {formikPass.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <div className={style.button__save}>
            <ButtonCreate
              text={"Сбросить"}
              type={"submit"}
              disabled={Object.keys(formikPass.errors).length > 0}
            />
          </div>
        </form>
      ),
    },
  ];

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData();
      const file = e.target.files[0];
      formData.append("image", file);
      await uploadAvatar(formData).then((response) => dispatch(updateInfoProfileAsync({avatarUser: response})));
    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = () => {
    logout();
    dispatch(addInfoProfile({}))
    navigate("/");
  };

  return (
    <section className={`${style.section_profile} wrapper profile-page`}>
      {contextHolder}
      <div className={style.bg_profile}></div>
      <ul className="bread-crumbs">
        <Link to="/">
          <li>Главная</li>
        </Link>
        <li>Профиль</li>
      </ul>
      <h2 className={`${style.section_title} section__title`}>Профиль</h2>
      <div className={style.main__block__profile}>
        <div className={style.block__user}>
          <div className={style.header__block}>
            <div className={style.update__image__block}>
              <img src={profile.avatarUser} alt="Avatar" />
            </div>
            <div className={style.status__user}>
              {
                profile.isActivated ?
                <p className={style.user__link_ok}>Подтвержден</p>
                :
                <p className={style.user__link_err}>Не подтвержден</p>
              }
              <p className={style.fullname__name}>
                {profile.name + " " + profile.surname}
              </p>
            </div>
            <input
              ref={inputFileRef}
              type="file"
              onChange={handleChangeFile}
              hidden
              name="avatar"
            />
            <div className={style.block__bittons__profile}>
              <button
                className={`${style.button__header__block} ${style.button__add__photo}`}
                onClick={(e) => {
                  inputFileRef.current.click();
                  e.preventDefault();
                }}
              >
                Добавить фото
              </button>
              <button
                className={`${style.button__header__block} ${style.button__delete__photo}`}
                onClick={logoutUser}
              >
                Выйти
              </button>
            </div>
          </div>
          <Tabs defaultActiveKey="1" items={itemsTabs}></Tabs>
        </div>

        <Modal
          title="Товары заказа"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={950}
          footer={null}
          className="profile-ant"
        >
          {selectedItems && selectedItems.slice().reverse().map((item, index) => (
                <ModalProfileItem key={index} item={item}/>
          ))}
        </Modal>

        <Modal
          title="Товары заказа"
          open={isModalOpenConstructor}
          onOk={handleOk}
          onCancel={handleCancel}
          width={900}
          footer={null}
          className="profile-ant constructor"
        >
          <div className={style.constructor_list_item}>
              {selectedItemsConstructor && selectedItemsConstructor.slice().reverse().map((item, index) => (
                  <ModalItemConstructor key={index} item={item} />
              ))}
          </div>
        </Modal>

        <div className={style.block__order}>
          <h3 className={style.order__title}>Мои заказы</h3>
          <Tabs defaultActiveKey="1" items={orderItemsTabs}></Tabs>
        </div>
      </div>
    </section>
  );
};

export default Profile;
