/* eslint-disable react/prop-types */
import style  from './stepsCard.module.scss'

const StepsCard = ({img, title, text}) => {
    return ( 
        <div className={style.steps_block}>
            <div className={style.block_image}>
                <img className={style.image} src={img} alt='step image'/>
            </div>
            <h1 className={style.title}>{title}</h1>
            <p className={style.text}>{text}</p>
        </div>
    );
}
 
export default StepsCard;