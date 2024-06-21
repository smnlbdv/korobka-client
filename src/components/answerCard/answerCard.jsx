/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import style from './answerCard.module.scss'

const AnswerCard = ({id, image, title, text, openAnswer, open = false}) => {

    const [openTwo, setOpenTwo] = useState(false)
    const [openCard, setOpenCard] = useState(open)


    useEffect(() => {
        if(open == id) {
            setOpenCard(open)
            setOpenTwo(true)
        } else {
           setOpenCard(false)
           setTimeout(() => {
            setOpenTwo(false)
           }, 200)
        }
    }, [id, open])
    
    return ( 
        <div className={`${style.answer_block} ${openCard ? style.open : ''} answer_item`} id="answers">
            <div className={style.answer_info}>
                <div className={style.image_block}>
                    <img className={style.answer_image} src={image} alt="answer" onClick={() => openAnswer(id)}/>
                </div>
                <div className={`${style.answer_text_wrapper}`}>
                    <div className={`${style.answer_text_wrapper} ${openTwo ? style.openTwo : style.closedTwo}`}>
                        <div className={style.block_text}>
                            <h2 className={style.answer_title}>{title}</h2>
                            <p className={style.answer_text}>{text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
 
export default AnswerCard;