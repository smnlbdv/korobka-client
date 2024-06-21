import { useState, useContext, useEffect } from "react";
import { Tabs, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import style from "./productPage.module.scss";
import api from "../../api/api.js";
import './ant.css'

import AdminProductItem from "../../components/adminProductItem/adminProductItem.jsx";
import { AdminContext } from "../../context/adminContext.js";
import { AuthContext } from "../../context/authContext.js";

const ProductPage = () => {
  const [selectedImage, setSelectedImage] = useState('');
  const [pathImage, setPathImage] = useState('');
  const [categoryInput, setCategoryInput] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  const { allProduct, contextHolder, contextHolderEmail} = useContext(AdminContext);
  const { categories} = useContext(AuthContext);


  useEffect(() => {
    const items = categories.map(obj => ({ value: obj.value }));
    setOptions(items);
  }, [categories])

  const itemsTabs = [
    {
      key: "1",
      label: "Все товары",
      children: (
        <div className={style.product__admin__block}>
          {allProduct.map((obj, index) => (
            <AdminProductItem key={obj._id} {...obj} />
          ))}
        </div>
      ),
    }
  ];

  return (
    <div className={style.block__product}>
      {contextHolder}
      {contextHolderEmail}
      <Tabs defaultActiveKey="1" items={itemsTabs}></Tabs>
    </div>
  );
};

export default ProductPage;
