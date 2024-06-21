import style from './likeButton.module.scss'
import api from '../../api/api';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';

// eslint-disable-next-line react/prop-types
const LikeButton = ({id, countLikes, setCountLikes, likes}) => {

    
    const [isLike, setIsLike] = useState(false)
    const {openNotificationError, userId, role, isAuth} = useContext(AuthContext)

    useEffect(() => {
        const result = likes.includes(userId)
        setIsLike(result)
    }, [likes])

    const likeReview = async () => {
        try {
            await api.post(`/api/reviews/like-review/${id}`)
                     .then((response) => {
                        if(response.data.liked) {
                            setIsLike(response.data.liked)
                            setCountLikes(response.data.like)
                        } else {
                            setIsLike(response.data.liked)
                            setCountLikes(response.data.like)
                        }
                     })
        } catch (error) {
            openNotificationError('bottomRight', "Ошибка");
        }
    }

    return ( 
        <div className={isLike ? style.likes__review_true : style.likes__review} onClick={likeReview}>
            <div className={style.img_block}>
                <img src={isLike ? "/assets/like-true.svg" : "/assets/like.svg"} alt="Icon like" />
            </div>
            <p>{countLikes}</p>
        </div>
     );
}
 
export default LikeButton;