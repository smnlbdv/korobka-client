/* eslint-disable react/prop-types */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Tooltip } from 'antd';

import { AuthContext } from "../../context/authContext.js";

import style from "./profileOrederItem.module.scss";
import './ant.css'
import { useDispatch } from "react-redux";
import { deleteOrderItemAsync } from "../../store/profileSlice.js";

const ProfileOrderItem = ({_id, groupImage = [], wayPay, totalAmount, address, status, onClick }) => {
    const [urlCheck, setUrlCheck] = useState("")
    const urlCheckLink = useRef()
    const [widthMultiplier, setWidthMultiplier] = useState()
    const { postCheckOrder, openNotification } = useContext(AuthContext);
    const [newTotalFormat, setNewTotalFormat] = useState()
    const dispatch = useDispatch()

    useEffect(() => {
        setNewTotalFormat(totalAmount.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}))
    }, [])

    const clickDeleteOrder = () => {
        dispatch(deleteOrderItemAsync(_id))
                .then((response) => {
                    openNotification('bottomRight', response.payload.message)
                })
    }

    const clickCheckOrder = async (e) => {
        e.preventDefault();
        let timeoutId;
        try {
            const response = await postCheckOrder(_id);
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

    useEffect(() => {
        setWidthMultiplier(groupImage.length > 3 ? 200 : 55 * groupImage.length);
    }, [groupImage.length])

    return (
        <div className={style.order__item_block}>
            <div className={style.order__click__block} onClick={clickItem}>
                <div className={style.order__images} style={ { width: widthMultiplier + 'px' } }>
                {
                    groupImage.map((item, index) => (
                        index < 3 ? (
                            <div className={style.image__block} key={index}>
                                <img 
                                className={style.image_product} 
                                src={item.productId.img} 
                                style={{ transform: `translateX(${index * -40}px)` }} 
                                alt="Image order"/>
                            </div>
                        ) : index === 3 ? (
                            <div key={index} className={style.block__count}>
                                <p className={style.countOrder}>
                                    +{groupImage.length - 3}
                                </p>
                            </div>
                        ) : null
                    ))
                }
                </div>
                <div className={style.list__info__order}>
                    <p><b>Адрес:</b> {address}</p>
                    <p><b>Способ оплаты:</b> {wayPay.name}</p>
                </div>
                
                <p className={style.price}>{newTotalFormat} BYN</p>
                <span className={style.order__item__status}>{status.name}</span>
            </div>
            <div>
                <Tooltip placement="right" title={"Удалить"} color={"red"}>
                    <button className={style.btn__delete_order}>
                        <img
                            className={style.delete_icon}
                            src="/assets/btn-cart-delete.svg"
                            alt=""
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

export default ProfileOrderItem;
