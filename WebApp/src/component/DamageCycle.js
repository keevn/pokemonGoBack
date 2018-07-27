import React from 'react';

const DamageCycle = (props) => {
    const {damage,critical} = props;
    const criticalType = {
        color: '#aa1121',
        textShadow: '0 1px #aa1121, 1px 0 #aa1121, -1px 0 #aa1121, 0 -1px #aa1121',
    }

    const style=critical? criticalType:{};

    return damage? <div className='damageCycle'>
        <span className='pokemon-stats' style={style} >{damage}</span>
    </div>:null;
};

export default DamageCycle;