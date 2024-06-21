
import { Tabs, Select } from "antd";

import style from "./onePostCard.module.scss";
import './ant.css'

import { AdminContext } from "../../context/adminContext.js";
import { useContext } from "react";
import AdminProduct from "../../components/adminProduct/adminProduct.jsx";

const OnePostCard = () => {
  const { postCard, contextHolder, contextHolderEmail} = useContext(AdminContext);

  const itemsTabs = [
    {
      key: "1",
      label: "Все открытки",
      children: (
        <div className={style.product__admin__block}>
          {postCard && postCard.map((obj, index) => (
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

export default OnePostCard;
