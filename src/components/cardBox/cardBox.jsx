import { useContext, useEffect, useState } from "react";
import style from "./cardBox.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../context/authContext";
import { Progress } from 'antd';
import {
  addTypesAsync,
  incBoxTypeGiftAsync,
  incProductAsync,
  addPostCardAsync,
  addProductAsync,
  decBoxTypeGift,
  decProductGift,
  decPostCardGift,
  delBoxTypeGift,
  delProductGift,
  delPostCardGift,
  isSimpleBox,
  incPostCardAsync
} from "../../store/prefabricatedGiftSlice";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// eslint-disable-next-line react/prop-types
const CardBox = ({ obj, type, simpleBox = false }) => {
  const {_id, photo, title, price, count } = obj;

  const typesBox = useSelector((state) => state.prefabricatedGift.typesBox);
  const product = useSelector((state) => state.prefabricatedGift.product);
  const postcards = useSelector((state) => state.prefabricatedGift.postcards);
  const [isAdded, setIsAdded] = useState(false);
  const [countProduct, setCountProduct] = useState(0);
  const dispatch = useDispatch();
  const { openNotification, openNotificationError } = useContext(AuthContext);
  const [simpleButton, setSimpleButton] = useState(false);
  const [percent, setPercent] = useState(0)
  const customColors = {
    '100%': '#8000ff',
    '0%': '#8000ff',
  };

  const [newTotalFormat, setNewTotalFormat] = useState()

  useEffect(() => {
    setNewTotalFormat(price.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2}))
  }, [])

  useEffect(() => {
    setPercent((count / 200) * 100)
  }, [count])

  const clickToConstructor = () => {
    if(simpleBox) {
        dispatch(delBoxTypeGift(_id))
        dispatch(isSimpleBox(false))
    } else {
        dispatch(addTypesAsync({ _id, photo, title, price, count: 1 }));
        dispatch(isSimpleBox(true));
        openNotification("bottomRight", "Коробка успешно добавлена");
    }
  }

  useEffect(() => {
    if (type === "boxTypes") {
      const foundBox = typesBox.find(box => box._id === _id);
      if (foundBox === undefined) {
        setCountProduct(0);
        setIsAdded(false)
      } else {
        setCountProduct(foundBox.count);
        setIsAdded(true)
      }
    }
  }, [typesBox]);

  useEffect(() => {
    if (type === "product") {
      const foundBox = product.find(box => box._id === _id);
      if (foundBox === undefined) {
        setCountProduct(0);
        setIsAdded(false)
      } else {
        setCountProduct(foundBox.count);
        setIsAdded(true)
      }
    }
  }, [product]);

  useEffect(() => {
    if (type === "postCard") {
      const foundBox = postcards.find(box => box._id === _id);
      if (foundBox === undefined) {
        setCountProduct(0);
        setIsAdded(false)
      } else {
        setCountProduct(foundBox.count);
        setIsAdded(true)
      }
    }
  }, [postcards]);

  useEffect(() => {
    if(obj._id === "6666d4b8c61593814e392cb3") {
      setSimpleButton(true)
    }
  }, [])

  const subtractProduct = () => {
    if (countProduct <= 1) {
      if (type === "boxTypes") {
        handleDelItem(delBoxTypeGift)
        openNotification("bottomRight", "Коробка удалена")
        setCountProduct(0)
        setIsAdded(false)
      }
  
      if (type === "product") {
        handleDelItem(delProductGift)
        openNotification("bottomRight", "Продукт удален")
        setCountProduct(0)
        setIsAdded(false)
      }
  
      if (type === "postCard") {
        handleDelItem(delPostCardGift)
        openNotification("bottomRight", "Открытка удалена")
        setCountProduct(0)
        setIsAdded(false)
      }

    } else {
      if (type === "boxTypes") {
        handleAddDec(decBoxTypeGift);
        setCountProduct(countProduct - 1)
      }
  
      if (type === "product") {
        handleAddDec(decProductGift);
        setCountProduct(countProduct - 1)
      }
  
      if (type === "postCard") {
        handleAddDec(decPostCardGift);
        setCountProduct(countProduct - 1)
      }
    }
  };

  const handleAddItems = (findType, addAction, notificationMessage) => {
    dispatch(addAction({ _id, photo, title, price, count: 1}))
            .then(() => {
              const typeFind = findType.find((obj) => obj._id === _id);

              if (!typeFind) {
                setCountProduct(1);
              } else {
                setCountProduct(typeFind.count + 1);
              }
          
              setIsAdded(true);
              openNotification("bottomRight", notificationMessage);
          })
          .catch(() => {
              setCountProduct(0)
              setIsAdded(false)
              openNotificationError('bottomRight', 'Товара недостаточно на складе');
          })

  };

  const handleAddInc = (incAction) => {
    dispatch(incAction({_id: _id, count: countProduct}))
            .then(() => {
              setCountProduct(countProduct + 1)
            })
            .catch(() => {
              openNotificationError("bottomRight", "Товара недостаточно на складе");
            })
  };

  const handleDelItem = (incAction) => {
    dispatch(incAction(_id));
  };

  const handleAddDec = (decAction) => {
    if (countProduct <= 1) {
      setIsAdded(false);
      // dispatch(deleteCartItemAsync(_id))
      //         .then(() => {
      //             setIsAdded(false)
      //         })
    } else {
      setCountProduct(countProduct - 1);
      dispatch(decAction(_id));
    }
  };

  const clickBtnAdd = async () => {

    if (type === "boxTypes") {
      handleAddItems(typesBox, addTypesAsync, "Коробка успешно добавлена");
    }

    if (type === "product") {
      handleAddItems(product, addProductAsync, "Товар успешно добавлен");
    }

    if (type === "postCard") {
      handleAddItems(postcards, addPostCardAsync, "Открытка успешно добавлена");
    }
  };

  const addProduct = () => {
    if (countProduct > 200) {
      setCountProduct(countProduct);
    } else {
      if (type === "boxTypes") {
        handleAddInc(incBoxTypeGiftAsync);
      }

      if (type === "product") {
        handleAddInc(incProductAsync);
      }

      if (type === "postCard") {
        handleAddInc(incPostCardAsync);
      }
    }
  };

  return (
    <div className={style.main__type_block}>
      <div className={style.main__type_image}>
        <a data-fancybox="gallery" href={photo}>
          <img src={photo} alt="Photo" />
        </a>
      </div>
      <h2 className={style.main__type_title}>{title}</h2>
      <div className={style.instock__product}>
              <p>Осталось: {count} шт.</p>
              <div className={style.bar_block}>
                <Progress percent={percent} strokeWidth={4} showInfo={false} strokeColor={customColors} trailColor="#000589"/>
              </div>
      </div>
      <p className={style.main__type_price}>Цена: {newTotalFormat} BYN</p>
      <div className={style.button__add_cart}>
      {
        !simpleButton && isAdded ? 
          <div className={style.counter__block}>
            <img
              className={style.counter__image}
              src="/assets/product-cart-decrease.svg"
              alt="Decrease"
              onClick={subtractProduct}
            />
            <div className={style.counter__info}>
              <p className={style.counter__count}>{countProduct} шт.</p>
            </div>
            <img
              className={style.counter__image}
              src="/assets/product-cart-increase.svg"
              alt="Increase"
              onClick={addProduct}
            />
          </div>
        : 
         simpleButton ? 
            <button className={!simpleBox ? style.main__type_button : style.main__type_button_del} onClick={count !== 0 && clickToConstructor}>
              {count <= 0 ? (
                <p>Нет в наличии</p>
              ) : (
                simpleBox ? (
                  <p>Удалить</p>
                ) : (
                  <p>Стилизовать</p>
                )
              )}
            </button>
            :
            <button className={style.main__type_button} onClick={count !== 0 && clickBtnAdd}>
              {
                  count <= 0 ?
                  <p>Нет в наличии</p>
                  :
                  <p>Добавить</p>
              }
            </button>
      }
      </div>
    </div>
  );
};

export default CardBox;
