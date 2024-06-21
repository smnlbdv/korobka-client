/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from 'antd';

import { AuthContext } from "../../context/authContext.js";

import style from "./profileOrderConstructor.module.scss";
import { useDispatch } from "react-redux";
import { deleteConstructorItemAsync } from "../../store/profileSlice.js";

const ProfileOrderConstructor = ({_id, wayPay, totalAmount, address, status, image, onClick, title }) => {
    const [urlCheck, setUrlCheck] = useState("")
    const urlCheckLink = useRef()
    const { postCheckOrderConstructor, openNotification } = useContext(AuthContext);
    const dispatch = useDispatch()
    const [newTotalFormat, setNewTotalFormat] = useState()

    useEffect(() => {
        setNewTotalFormat(totalAmount.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}))
    }, [totalAmount])

    const clickDeleteOrder = () => {
        dispatch(deleteConstructorItemAsync(_id))
                .then((response) => {
                    openNotification('bottomRight', response.payload.message)
                })
    }

    const clickCheckOrder = async (e) => {
        e.preventDefault();
        let timeoutId;
        try {
            const response = await postCheckOrderConstructor(_id);
            if (response) {
                setUrlCheck(response)
                timeoutId = setTimeout(() => {
                    urlCheckLink.current.click();
                }, 200)
            }
        } catch (error) {
            console.log(error);
        }
        return () => clearTimeout(timeoutId);
    };

    const clickItem = () => {
        onClick(_id)
    }

    return (
        <div className={style.order__item_block}>
            <div className={style.order__click__block} onClick={clickItem}>
                <div className={style.order__images}>
                    <div className={style.image__block}>
                        <img 
                            className={style.image_product} 
                            src={image} 
                            alt="Image order"
                        />
                    </div>
                </div>
                <div className={style.constructor_block}>
                    <p className={style.title_order}>{title}</p>
                    <div className={style.list__info__order}>
                        <p><b>Адрес:</b> {address}</p>
                        <p><b>Способ оплаты:</b> {wayPay.name}</p>
                    </div>
                </div>
                
                <div className={style.price}>{newTotalFormat} BYN</div>
                <span className={style.order__item__status}>{status.name}</span>
            </div>
            <div>
                <Tooltip placement="right" title={"Удалить"} color={"red"}>
                    <button className={style.btn__delete_order}>
                        <img
                            className={style.delete_icon}
                            src="/assets/btn-cart-delete.svg"
                            alt="Delete icon"
                            onClick={clickDeleteOrder}
                        />
                    </button>
                </Tooltip>
                <Tooltip placement="right" title={"Чек"} color={"green"}>
                    <a className={style.btn__check_order} href={urlCheck} ref={urlCheckLink} target="_blank" rel="noreferrer">
                        <img
                            className={style.delete_icon}
                            src="/assets/btn-cart-check.svg"
                            alt=""
                            onClick={clickCheckOrder}
                        />
                    </a>
                </Tooltip>
            </div>
        </div>
  );
};

export default ProfileOrderConstructor;