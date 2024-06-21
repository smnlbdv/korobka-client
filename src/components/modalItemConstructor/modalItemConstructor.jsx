
import { useEffect, useRef, useState } from 'react';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import style from './modalItemConstructor.module.scss'

// eslint-disable-next-line react/prop-types
const ModalItemConstructor = ({item}) => {

    const openConstructorItem = useRef(null)

    const [newTotalFormat, setNewTotalFormat] = useState()

    useEffect(() => {
        setNewTotalFormat(item.productId.price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}))
    }, [item.productId.price])

    useEffect(() => {
        const containerTypes = openConstructorItem.current;
    
        const delegate = "[data-fancybox]";
        const options = {};
    
        NativeFancybox.bind(containerTypes, delegate, options);
    
        return () => {
          NativeFancybox.unbind(containerTypes);
          NativeFancybox.close();
        };
    }, []);

    return ( 
        <div className={style.main__block__modal}>
            <div className={style.modal__block__items} ref={openConstructorItem}>
                <div className={style.modal__block__image}>
                    <a data-fancybox="gallery" href={item.productId.photo}>
                        <img src={item.productId.photo} alt="" />
                    </a>
                </div>
                <div className={style.modal__block__description}>
                    <p className={style.modal__item__title}>
                    {item.productId.title}
                    </p>
                </div>
                <p className={style.modal__item__quantity}>
                    Кол-во: {item.quantity}
                </p>
                <div className={style.modal__item__price}>
                    Цена: <br></br>{newTotalFormat} BYN
                </div>
            </div>
        </div>
     );
}
 
export default ModalItemConstructor;