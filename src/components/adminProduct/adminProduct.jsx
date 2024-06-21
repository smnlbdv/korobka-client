
import { useEffect, useRef, useState } from 'react';
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import style from './adminProduct.module.scss'

// eslint-disable-next-line react/prop-types
const AdminProduct = ({item}) => {
    const openConstructorItem = useRef(null)

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
                    <a data-fancybox="gallery" href={item.photo}>
                        <img src={item.photo} alt="" />
                    </a>
                </div>
                <div className={style.modal__block__description}>
                    <p className={style.modal__item__title}>
                        {item.title}
                    </p>
                    <p className={style.modal__item__quantity}>
                        Цена: {item.price}
                    </p>
                </div>
                <button className={`${style.button} ${style.button__delete}`}>
                        <img src="/assets/btn-cart-delete.svg" alt="Delete" />
                </button>
            </div>
        </div>
     );
}
 
export default AdminProduct;