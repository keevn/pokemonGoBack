import React from 'react';
import { Tooltip } from 'antd';

const AttachedItem = (props) => {
    const {item} = props;

    if (item)  {
        const style={
            backgroundColor:'#ffffff',
            backgroundImage: 'url(' + require(`./images/cards/${item.id}.png`) + ')',
            backgroundPosition: '-10px -25px',
            backgroundSize: '93px 153px',
            backgroundRepeat:'no-repeat',
            backgroundClip:'padding-box',
        };
        

        return (
            <div>
                <Tooltip placement="bottomLeft" title={item.ability.desc} overlayClassName='pokemon'>
                    <div className='attachedItem' style={style}/>
                </Tooltip>
            </div>
        );

    }else {

        return null;

    }

};

export default AttachedItem;