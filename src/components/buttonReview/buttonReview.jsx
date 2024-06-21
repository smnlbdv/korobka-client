import { Link } from "react-router-dom";
import style from './buttonReview.module.scss'

// eslint-disable-next-line react/prop-types
const ButtonReview = ({id}) => {
    return ( 
        <button className={style.button__review}>
            <Link to={`/product/${id}/review`}>
                Оставить отзыв
            </Link>
        </button>
     );
}
 
export default ButtonReview;