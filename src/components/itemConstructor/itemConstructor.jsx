import { useEffect, useState } from 'react';
import style from './itemConstructor.module.scss'
import { useDispatch } from 'react-redux';
import { deleteItemConstructor, isSimpleBox } from '../../store/prefabricatedGiftSlice';

const itemConstructor = ({_id, photo, title, price, count }) => {

    const dispatch = useDispatch()
    const [newTotalFormat, setNewTotalFormat] = useState()

    useEffect(() => {
        setNewTotalFormat(price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}))
    }, [])

    const clickDeleteButton = () => {
        if(_id === "6666d4b8c61593814e392cb3") {
            dispatch(isSimpleBox(false))
        }
        dispatch(deleteItemConstructor(_id))
    }

    return ( 
        <div className={style.constructor__item_block}>
            <div className={style.image__block}>
                <img className={style.image_product} src={photo} alt="Image item" />
            </div>
            <div className={style.header_item}>
                <p className={style.title}> {title}</p>
                <p className={style.count__product}>Кол-во: {count}</p>
            </div>
            <p className={style.price}>{newTotalFormat} BYN</p>
            <button className={style.btn__delete_item}>
                <img
                    className={style.delete_icon}
                    src="/assets/close-square.svg"
                    alt=""
                    onClick={clickDeleteButton}
                />
            </button>
        </div>
     );
}
export default itemConstructor;