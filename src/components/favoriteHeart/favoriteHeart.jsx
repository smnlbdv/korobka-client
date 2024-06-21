import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext.js";
import { addProductFavorite, addProductFavoriteAsync, delProductFavoriteAsync } from "../../store/likedSlice.js";
import { useSelector, useDispatch } from "react-redux";

import style from './favoriteHeart.module.scss'

// eslint-disable-next-line react/prop-types
const FavoriteHeart = ({_id, favorite = false}) => {
    const [isFavorite, setIsFavorite] = useState(favorite);
    const favoriteItem = useSelector(state => state.liked.liked)
    const dispatch = useDispatch()

    useEffect(() => {
        const isExist = favoriteItem.some((product) => product._id === _id);
        setIsFavorite(isExist)
    }, [_id, favoriteItem])

    const clickHeart = () => {
        if(isFavorite) {
            dispatch(delProductFavoriteAsync(_id))
            setIsFavorite(false)
        } else {
            dispatch(addProductFavoriteAsync(_id))
            setIsFavorite(true)
        }
    }

    return ( 
        <div className={!isFavorite ? style.button__add_favorite : style.button__add_favorite_love} onClick={clickHeart}>
            <img className={style.favorite} src={isFavorite ? "/assets/favorite-love.svg" : "/assets/love.svg"} alt=""/>
        </div>
     );
}
 
export default FavoriteHeart;