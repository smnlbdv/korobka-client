import React from 'react';
import { useSelector } from 'react-redux';
import ProfileOrderItem from '../profileOrderItem/profileOrderItem.jsx'

import style from './profileOrderBlock.module.scss'

const ProfileOrdersBlock = ({ showModal }) => {
    const order = useSelector(state => state.profile.order)
    return (
      <div className={style.block__orders}>
        {order.slice().reverse().map((obj, index) => (
            <ProfileOrderItem
                key={obj._id}
                groupImage={obj.items}
                {...obj}
                onClick={showModal}
            />
        ))}
      </div>
    );
  };
  
  export default ProfileOrdersBlock;