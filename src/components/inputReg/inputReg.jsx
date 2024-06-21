/* eslint-disable react/prop-types */
import { useState } from "react";

import style from './inputReg.module.scss'
import mask from '../inputProfile/mask.js'

const InputReg = ({id, img, name, placeholder, onChange, type, chek = false, value = "", errorChange, tel = false, clearFieldById }) => {

    const [show, setShow] = useState(false)

    const showPass = async () => {
        setShow(!show)
    }

    const validNumber = (event) => {
        const value = mask(event);
        onChange(value);
    };

    const clearInput = () => {
        clearFieldById(id)
    }

    return ( 
        <div className={errorChange ? style.input__error : style.input_block}>
            {tel && 
                <div className={style.main_input_block}>
                    <img className={style.img} src={img} alt="" />
                    <input className={style.input} id={id} name={name} onChange={validNumber} type={type} placeholder={placeholder} value={value} />
                    {
                        !chek && <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInput}/>
                    }
                </div>
            }
            {!tel &&
                <div className={style.main_input_block}>
                    <img className={style.img} src={img} alt="" />
                    <input className={style.input} name={name} id={id} type={show ? "text" : type} value={value} placeholder={placeholder} onChange={onChange} required/>
                    {
                        !chek && <img className={style.close_icon} src="/assets/close-icon.svg" alt="Icon clear" onClick={clearInput}/>
                    }
                </div>
            }
            {
                chek && <img  className={style.img_secret} src="/assets/secret.svg" alt="secret" onClick={showPass} />
            }
        </div>
    );
}
 
export default InputReg;