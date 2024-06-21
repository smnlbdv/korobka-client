
import { Tabs, Select } from "antd";

import style from "./oneProductPage.module.scss";
import './ant.css'

import { AdminContext } from "../../context/adminContext.js";
import { useContext } from "react";
import AdminProduct from "../../components/adminProduct/adminProduct.jsx";

const OneProductPage = () => {
  const { product, contextHolder, contextHolderEmail} = useContext(AdminContext);

  const itemsTabs = [
    {
      key: "1",
      label: "Все товары",
      children: (
        <div className={style.product__admin__block}>
          {product && product.map((obj, index) => (
             <AdminProduct key={index} item={obj} />
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

export default OneProductPage;
