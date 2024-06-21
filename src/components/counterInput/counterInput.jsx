import { useContext, useRef, useState } from "react";
import debounce from "debounce";
import { AuthContext } from "../../context/authContext.js";

import style from './counterInput.module.scss'
import { useDispatch, useSelector } from "react-redux";
import { decreaseCartItemAsync, deleteCartItemAsync, increaseCartItemAsync, updateCountItemAsync } from "../../store/cartSlice.js";

// eslint-disable-next-line react/prop-types
const CounterInput = ({ count, _id }) => {
    const [countNew, setCountNew] = useState(count)
    const [input, setInput] = useState(false);
    const { openNotification, openNotificationError } = useContext(AuthContext);
    const dispatch = useDispatch()
    const inputRef = useRef();

     const subtractProduct = async () => {
      if (countNew <= 1) {
        dispatch(deleteCartItemAsync(_id))
                .then(() => {
                  openNotification("bottomRight", "Товар удален из корзины")
                })
      } else {
        const resultIncrease = dispatch(decreaseCartItemAsync(_id));
        if (resultIncrease) {
          setCountNew(countNew - 1);
        }
      }
    };

    const debouncedHandleChange = debounce((_id, countInput) => {
      dispatch(updateCountItemAsync({id:_id, countInput: countInput}))
                      .then(() => {
                        setCountNew(countInput)
                        setInput(false)
                      })
                      .catch(() => {
                        setCountNew(count)
                        setInput(true)
                        const errorMessage = localStorage.getItem('errorMessage')
                        openNotificationError("bottomRight", errorMessage)
                        localStorage.removeItem('errorMessage')
                      })
    }, 500);

    const handleChange = (e) => {
      let newValue = e.target.value 
      
      if(newValue === "-" || isNaN(newValue) || newValue > 200) {
        setCountNew(200)
        setTimeout(() => {
          inputRef.current.blur();
        }, 500)
      } else {
        setCountNew(newValue)
        setTimeout(() => {
          inputRef.current.blur();
        }, 500)
      }
    };

    const changeOnInput = () => {
      setInput(true);
    };
  
    const onBlurInput = (e) => {
      let newValue = e.target.value 
      if(newValue === "-" || isNaN(newValue) || newValue > 200) {
        debouncedHandleChange(_id, 200);
      } else {
        debouncedHandleChange(_id, Number(newValue));
      }
    };

    const addProduct = async () => {
      if (countNew >= 200) {
        setCountNew(countNew);
      } else {
        dispatch(increaseCartItemAsync({_id: _id, countProduct: countNew}))
                    .then(result => {
                        if(result.payload.increase) { 
                          setCountNew(countNew + 1)
                            openNotification('bottomRight', 'Количество товара увеличено');
                        }
                    })
                    .catch(() => {
                      setCountNew(countNew)
                        openNotificationError('bottomRight', 'Товара недостаточно на складе');
                    })
      }
    };

    return ( 
        <div className={style.counter__block}>
            <button className={style.btn_counter} onClick={subtractProduct}>
                <img className={style.counter_icon} src="/assets/btn-cart-minus.svg" alt="" />
            </button>
            {
                input ?
                <input className={style.count_input} type="text" value={countNew} onInput={handleChange} onBlur={onBlurInput} ref={inputRef}/>
                :
                <p className={style.count} onClick={changeOnInput}>{countNew}</p>
            }
            <button className={style.btn_counter} onClick={addProduct}>
                <img className={style.counter_icon} src="/assets/btn-cart-plus.svg" alt="" />
            </button>
        </div>
     );
}
 
export default CounterInput;