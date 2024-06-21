import { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/adminContext";
import {XYPlot, VerticalBarSeries, XAxis, YAxis, VerticalGridLines, HorizontalGridLines} from 'react-vis';
import 'react-vis/dist/style.css';
import { Tabs, Select } from "antd";
import * as Yup from "yup";
import { AuthContext } from "../../context/authContext.js";
import { useFormik } from "formik";

import './ant.css'
import style from "./mainPageAdmin.module.scss";
import api from "../../api/api.js";
import InputProfile from "../../components/inputProfile/inputProfile.jsx";


const MainPageAdmin = () => {
    const { contextHolder, contextHolderEmail, dataCategory, dataOrder, totalPrice} = useContext(AdminContext);
    const [selectedImage, setSelectedImage] = useState('');
    const [pathImage, setPathImage] = useState('');
    const [categoryInput, setCategoryInput] = useState([]);
    const [options, setOptions] = useState([]);

    const { openNotification,setAllProduct} = useContext(AdminContext);
    const { categories } = useContext(AuthContext);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        setPathImage(file);

        reader.onload = () => {
        setSelectedImage(reader.result);
        };

        reader.readAsDataURL(file);
    };

    useEffect(() => {
        const items = categories.map(obj => ({ value: obj.value }));
        setOptions(items);
    }, [categories])

    const handleChange = (value) => {

        if(value.length !== 0) {
        const labels = value.map(item => {
            const foundItem = categories.find(option => option.value === item);
            return foundItem ? foundItem._id : null;
        });

        setCategoryInput(labels);
        formikProduct.setFieldValue("selectedOptions", "true");
        } else {
        formikProduct.setFieldValue("selectedOptions", "");
        }

    };

    const formikProduct = useFormik({
        initialValues: {
        title: "",
        text: "",
        price: "",
        preText: "",
        pageDesc: "",
        selectedOptions: ""
        },
        validationSchema: Yup.object({
        title: Yup.string().required(
            'Поле "Название продукта" обязательно для заполнения'
        ),
        selectedOptions: Yup.string().required('Это поле обязательно для выбора'),
        text: Yup.string().required('Поле "Текст" обязательно для заполнения'),
        price: Yup.number().required('Поле "Цена" обязательно для заполнения'),
        preText: Yup.string().required(
            'Поле "Краткое описание" обязательно для заполнения'
        ),
        pageDesc: Yup.string().required(
            'Поле "Описание страницы" обязательно для заполнения'
        ),
        }),

        onSubmit: async (item, { resetForm }) => {

        const formData = new FormData();

        formData.append("image", pathImage);

        categoryInput.forEach(category => {
            formData.append("category", category)
        })

        Object.keys(item).forEach(key => {
            formData.append(key, item[key]);
        });

        try {
            await api.post("/api/admin/add", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }})
            .then((response) => {
                if(response.status === 202) {
                resetForm();
                setSelectedImage(null)
                setPathImage(null)
                setCategoryInput(null)
                setOptions(null)
                setAllProduct((prev) => [...prev, response.data.newProduct])
                openNotification('bottomRight', 'Товар успешно добавлен в БД');
                }
            })
            .catch((response) => 
                console.log(response.message)
            );
        } catch (error) {
            console.log("Ошибка", error);
        }
        },
    })
    
    const itemsTabs = [
        {
          key: "1",
          label: "Статистика",
          children: (
            <div>
                <div>
                    <p className={style.total__price}>Общий бюджет: {totalPrice} BYN</p>
                </div>
                <div className={style.product__admin__block}>
                    <div>
                        <p className={style.title_stat_category}>Товары по категориям</p>
                        <XYPlot width={600} height={400} xType="ordinal">
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis title="Категории" style={{ text: { fill: 'white' } }} tickLabelAngle={-10}/>
                            <YAxis title="Число продаж" style={{ text: { fill: 'white' } }} />
                            <VerticalBarSeries
                                data={dataCategory}
                                colorType="literal"
                                getColor={(d) => d.color}
                            />
                        </XYPlot>
                    </div>
                    <div>
                        <p className={style.title_stat_category}>Оформленные заказы за 12 месяцев</p>
                        <XYPlot width={600} height={400} xType="ordinal">
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis title="Месяц" style={{ text: { fill: 'white' } }} tickLabelAngle={-20}/>
                            <YAxis title="Число продаж" style={{ text: { fill: 'white' } }} />
                            <VerticalBarSeries
                                data={dataOrder}
                                colorType="literal"
                                getColor={(d) => d.color}
                            />
                        </XYPlot>
                    </div>
                </div>
            </div>
          ),
        },
        {
          key: "2",
          label: "Добавить бокс",
          children: (
            <div className={style.main__block_product}>
                <form
                    className={style.form__add}
                    onSubmit={formikProduct.handleSubmit}
                >
                    <div className={style.form__block__input}>
                    <p>Введите название товара:</p>
                    <InputProfile
                        id="title"
                        name="title"
                        typeInput={"text"}
                        value={formikProduct.values.title}
                        onChange={formikProduct.handleChange}
                        placeholder={"Денежный бокс"}
                        errorChange={formikProduct.errors.title && "true"}
                    />
                    </div>
                    <div className={style.form__block__input}>
                    <p>Введите полное описание товара:</p>
                    <textarea 
                        id="text"
                        name="text"
                        value={formikProduct.values.text}
                        onChange={formikProduct.handleChange}
                        placeholder={"Этот бокс содержит в себе..."}
                        className={formikProduct.errors.text ? style.block__input__error : style.block__input}
                    ></textarea>
                    </div>
                    <div className={style.form__block__input}>
                    <p>Введите цену товара (BYN):</p>
                    <InputProfile
                        id="price"
                        name="price"
                        typeInput={"text"}
                        value={formikProduct.values.price}
                        onChange={formikProduct.handleChange}
                        placeholder={"1000 BYN"}
                        errorChange={formikProduct.errors.price && "true"}
                    />
                    </div>
                    <div className={style.form__block__input}>
                    <p>Введите категорию товара:</p>
                    <div className={formikProduct.errors.selectedOptions ? style.block__input__error_2 : style.block__select}>
                        <Select
                            mode="multiple"
                            placeholder="Мужской бокс"
                            onChange={handleChange}
                            options={options}
                        />
                    </div>
                    </div>
                    <div className={style.form__block__input}>
                    <p>Введите текст для карточки товара:</p>
                    <textarea 
                        id="preText"
                        name="preText"
                        value={formikProduct.values.preText}
                        onChange={formikProduct.handleChange}
                        placeholder={"Это самый..."}
                        className={formikProduct.errors.preText ? style.block__input__error : style.block__input}
                    ></textarea>
                    </div>
                    <div className={style.form__block__buttons}>
                    <label htmlFor="mainImage">Выбрать основное фото</label>
                    <input id="mainImage" name="mainImage" type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    <div className={style.form__block__input}>
                    <p>Введите описание для страницы описания товара:</p>
                    <textarea 
                        id="pageDesc"
                        name="pageDesc"
                        value={formikProduct.values.pageDesc}
                        onChange={formikProduct.handleChange}
                        placeholder={"Данный продукт является...."}
                        className={formikProduct.errors.pageDesc ? style.block__input__error : style.block__input}
                    ></textarea>
                    </div>

                    <button type="submit" className={style.form__buttons}>
                    Добавить новый товар
                    </button>
                </form>
                <div className={style.product__image}>
                    <div className={style.block__rigth}>
                    <img className={style.main__product__image} src={selectedImage} alt="" onDoubleClick={() => setSelectedImage(null)}/>
                    </div>
                </div>
                </div>
          ),
        },
        {
            key: "3",
            label: "Добавить категорию",
            children: (
              <div className={style.main__block_product}>
                
              </div>
            ),
        },
        {
            key: "4",
            label: "Добавить товар",
            children: (
              <div className={style.main__block_product}>
                
              </div>
            ),
        },
        {
            key: "5",
            label: "Добавить открытку",
            children: (
              <div className={style.main__block_product}>
                
              </div>
            ),
        },
        {
            key: "6",
            label: "Добавить тип",
            children: (
              <div className={style.main__block_product}>
                
              </div>
            ),
        },
        
      ];

    return ( 
        <div className={style.block__product}>
            {contextHolder}
            {contextHolderEmail}
            <Tabs defaultActiveKey="1" items={itemsTabs}></Tabs>
        </div>
     );
}
 
export default MainPageAdmin;