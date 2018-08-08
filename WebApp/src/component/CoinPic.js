import React from "react";
import coin from './images/coin.png';

const CoinPic = ({face_up=true}) =>  {

    const faceDownStyle={
        marginTop: -70,
    };

    return (
        <div style={{ position: 'absolute',top: 10,
            left: 405,
            width: 70,
            height: 70,
            overflow: 'hidden'}}>
            <img src={coin} alt="coin" style={Object.assign({},{width:70,height:140},face_up? {}:faceDownStyle)}/>
        </div>

    );
} ;

export default CoinPic;