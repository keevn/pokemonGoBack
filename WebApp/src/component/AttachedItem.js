import React from 'react';
import { Tooltip } from 'antd';

const AttachedItem = (props) => {
    const {item} = props;

    if (item)  {
        const style={
            backgroundColor:'#ffffff',
            backgroundImage: 'url(' + require(`./images/cards/${item.cardId}.png`) + ')',
            backgroundPosition: '-10px -25px',
            backgroundSize: '93px 153px',
            backgroundRepeat:'no-repeat',
            backgroundClip:'padding-box',
        };
        

        return (
                <Tooltip placement="bottomLeft" title={item.ability.desc} overlayClassName='pokemon'>
                    <div className='attachedItem' style={style}/>
                </Tooltip>
        );

    }else {

        return null;

    }

};

export default AttachedItem;