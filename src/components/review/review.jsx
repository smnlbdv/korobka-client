import { useContext, useEffect, useRef, useState } from 'react';
import { Rate } from 'antd';
import style from './review.module.scss'
import Rating from '@mui/material/Rating'
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Modal, Input } from 'antd';

import '../../libs/ant.css'
import LikeButton from '../likeButton/likeButton.jsx';
import { useSelector } from 'react-redux';
import './ant.css'
import { AuthContext } from '../../context/authContext.js';
import api from '../../api/api.js';

// eslint-disable-next-line react/prop-types
const Review = ({id, img, name, lastName, text, data, stars, likes = [], hidden = false, slider = [], comment = null, isComment = false }) => {

    const [countLikes, setCountLikes] = useState(0)
    const { openNotificationError } = useContext(AuthContext)
    const openBlock = useRef()
    const openBlockFooter = useRef()
    const openBlockComments = useRef()
    const role = useSelector(state => state.profile.role)
    const userId = useSelector(state => state.profile.userId)
    const photoRef = useRef(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [commentReview, setCommentReview] = useState(comment);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        if(inputText === '' || inputText.length < 50) {
            openNotificationError('bottomRight', "Некорректные данные")
        } else {
            await api.post("/api/reviews/create/comment", {reviewId: id, userId: userId, text: inputText})
                     .then((response) => {
                        setCommentReview({...response.data});
                        setVisible(false)
                     })
                     .catch(() => {
                        openNotificationError('bottomRight', "Произошла ошибка")
                     })
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleClick = (index) => {
        const photoRef = document.getElementById(`photo-${index}`);
        if (photoRef) {
            photoRef.click();
        }
    };

    const handleInputChange = e => {
        const text = e.target.value;
        setInputText(text);
    };

    const handleOpenGallery = () => {
        if(isGalleryOpen) {
            setIsGalleryOpen(false)
            openBlock.current.style.padding = "0px";
            openBlock.current.style.maxHeight = 0 + 'px';
            openBlock.current.style.height = 0 + 'px';
            openBlockFooter.current.style.boxShadow = 'rgba(0, 0, 0, 0) 0px -10px 20px';
        } else {
            setIsGalleryOpen(true)
            openBlock.current.style.padding = "30px 30px 20px 30px";

            const totalHeight = openBlock.current.scrollHeight +
                    parseInt(window.getComputedStyle(openBlock.current).paddingTop) +
                    parseInt(window.getComputedStyle(openBlock.current).paddingBottom) + 50;

            openBlock.current.style.maxHeight = totalHeight + "px";
            openBlock.current.style.height = totalHeight + "px";
            openBlockFooter.current.style.boxShadow = 'rgba(0, 0, 0, 0.21) 0px -10px 20px';
        }
    };

    const handleOpenCommnets = () => {
        if(isCommentsOpen) {
            setIsCommentsOpen(false)
            openBlockComments.current.style.padding = "0px";
            openBlockComments.current.style.maxHeight = 0 + 'px';
            openBlockComments.current.style.height = 0 + 'px';
            openBlockFooter.current.style.boxShadow = 'rgba(0, 0, 0, 0) 0px -10px 20px';
        } else {
            setIsCommentsOpen(true)
            const totalHeight = openBlockComments.current.scrollHeight +
                    parseInt(window.getComputedStyle(openBlockComments.current).paddingTop) +
                    parseInt(window.getComputedStyle(openBlockComments.current).paddingBottom) + 60;

            openBlockComments.current.style.maxHeight = totalHeight + "px";
            openBlockComments.current.style.height = totalHeight + "px";
            openBlockFooter.current.style.boxShadow = 'rgba(0, 0, 0, 0.21) 0px -10px 20px';
        }
    };

    useEffect(() => {
        const container = openBlock.current;
    
        const delegate = "[data-fancybox]";
        const options = {};
    
        NativeFancybox.bind(container, delegate, options);
    
        return () => {
          NativeFancybox.unbind(container);
          NativeFancybox.close();
        };

    }, []);

    useEffect(() => {
        setCountLikes(likes.length)
    }, [])

    return ( 
        <div className={slider.length == 0 ? style.slide_item : style.slide_item_photos}>
            {
                <Modal
                    title="Создание комментария"
                    open={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Отправить"
                    cancelText="Выйти"
                >
                     <Input.TextArea
                        placeholder="Введите текст"
                        value={inputText}
                        onChange={handleInputChange}
                        rows={4} 
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                    <p className={inputText.length < 50 ? style.count__word__error : style.count__word}>
                        {inputText.length} / 50
                    </p>
                </Modal>
            }
            <div className={style.review__header__block}>
                    <div className={style.slide_header}>
                        <div className={style.logo}>
                            <img className={style.image} src={img} alt="" />
                            <p className={style.first_last}>{name} {lastName}</p>
                        </div>
                        <div className={style.static} >
                            <Rating name="read-only" value={stars} readOnly />
                        </div>
                    </div>
                    <div className={style.text}>
                        <p>{text}</p>
                    </div>
                    <div className={style.footer__review}>
                        <span className={style.date}>{data}</span>
                        {
                            hidden && 
                            <LikeButton id={id} countLikes={countLikes} setCountLikes={setCountLikes} likes={likes}/>
                        }
                    </div>
            </div>
                <div className={style.footer__review__photos} ref={openBlockFooter}>
                    {
                        slider.length !== 0 &&
                        <div className={style.list__photos_review} ref={openBlock}>
                            {slider.map((photo, index) => (
                                <div className={style.photo__block} key={index} onClick={() => handleClick(index)}>
                                    <a data-fancybox="gallery" href={photo} id={`photo-${index}`}>
                                        <img src={photo} alt={"Photo review"} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    }
                    
                    <div className={style.list__comments_review} ref={openBlockComments}>
                        {
                            commentReview === null ?
                            <div className={style.block__create__comment}>
                                <p>У отзыва нет комментариев</p>
                                {
                                    role == 1 && <button className={style.open__modal__input} onClick={showModal}>Написать</button>
                                }
                            </div>
                            :
                            <div className={style.admin_review}>
                                <div className={style.header__comment}>
                                    <div>
                                        <img src={commentReview.owner.avatarUser} alt="User image" />
                                    </div>
                                    <h2 className={style.first_last}>{commentReview.owner.name} {commentReview.owner.surname}</h2>
                                    {
                                        role === 1 && <span>(Администратор)</span>
                                    }   
                                    {
                                        role === 2 && <span>(Модератор)</span>
                                    }
                                </div>
                                <p>{commentReview.text}</p>
                                <span>{commentReview.date}</span>
                            </div>
                        }
                    </div>
                    <div className={style.button__list}>
                        {slider.length > 0 && ( 
                            <button className={!isGalleryOpen ? style.button__open_gallery : style.button__open_gallery_grey} onClick={handleOpenGallery}>
                                {isGalleryOpen ? "Скрыть фото" : `Показать ${slider.length} фото`}
                            </button>
                        )}
                    
                        {
                            isComment &&
                            <button className={!isCommentsOpen ? style.button__open_comments : style.button__open_comments_grey} onClick={handleOpenCommnets}>
                                {isCommentsOpen ? "Скрыть комментарии" : "Показать комментарии"}
                            </button>
                        }
                    </div>
                </div>
        </div>
     );
}
 
export default Review;