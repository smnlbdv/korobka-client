import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

import style from './loading.module.scss'

const Loading = () => {
    return ( 
        <div className={style.loading_wrapper}>
            <Spin
            indicator={
            <LoadingOutlined
                style={{
                    fontSize: 80,
                    color: 'white',
                    fontWeight: 'bold',
                    }}
                spin
            />
            }
        />
        </div>
     );
}
 
export default Loading;