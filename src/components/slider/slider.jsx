import { useState } from 'react';
import { Slider, InputNumber } from 'antd';

import style from './slider.module.scss'

import '../../libs/ant.css'

// eslint-disable-next-line react/prop-types
const PriceFilter = ({filterPrice}) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1234);

  const handlePriceChange = (value) => {
    setMinPrice(value[0]);
    setMaxPrice(value[1]);
  };

  const fetchAllPrice = (event) => {
    filterPrice(event[0], event[1]);
  }

  return (
    <div className={style.block__slider}>
      <Slider range min={0} max={5000} value={[minPrice, maxPrice]} defaultValue={[0, 1234]} onChange={handlePriceChange} onChangeComplete={fetchAllPrice}/>
      <div className={style.block__inputs}>
        <InputNumber
            min={0}
            max={5000}
            value={minPrice}
            onChange={(value) => setMinPrice(value)}
        />
        <InputNumber
            min={0}
            max={5000}
            value={maxPrice}
            onChange={(value) => setMaxPrice(value)}
        />
      </div>
    </div>
  );
};

export default PriceFilter;